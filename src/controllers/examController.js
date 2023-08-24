const { Exam, Score, Question, ScoreExam, ExamType } = require("../models");
const response = require("./response");
const fs = require("fs");

Score.belongsToMany(Exam, {
  foreignKey: "score_id",
  through: ScoreExam,
  constraints: false,
});
Exam.belongsToMany(Score, {
  foreignKey: "exam_id",
  through: ScoreExam,
  constraints: false,
});

Exam.hasMany(Question, {
  foreignKey: "examId",
  constraints: false,
});
Question.belongsTo(Exam, {
  foreignKey: "examId",
  constraints: false,
});

async function tambahExam(req, res) {
  try {
    let {
      exam_type,
      exam_name,
      kkm_point,
      available_try,
      question_text,
      correct_answer,
      question_type,
      card_answers,
      answer_with_image,
    } = req.body;

    let card_answer_index = 0;
    card_answers = JSON.parse(card_answers);
    answer_with_image = JSON.parse(answer_with_image);

    const score = await Score.findAll();
    const exam = await Exam.create({
      exam_type,
      exam_name,
      kkm_point,
      available_try,
    });

    if (Array.isArray(question_text)) {
      let question_with_img = req.body.index_deleted.split(",");
      let count = 0;
      let answer_count = 0;
      // LOOP THROUGH QUESTION
      question_text.forEach(async (qt, index) => {
        if (question_type[index] == "pilihan_ganda") {
          // HANDLE IMAGE
          const filteredData = req.files.filter((item,idx) =>{
            return item.fieldname.startsWith("answer_image_")
          });
          const question_image = req.files.filter(
            (item) => item.fieldname === `question_img`
          );

          let img = "";
          if (question_with_img.includes(index.toString())) {
            img = `${req.protocol + "://" + req.get("host")}/files/uploads/${
              question_image[count].filename
            }`;
            count += 1;
          } else {
            img = null;
          }

          let answers = [correct_answer[answer_count], ...req.body.wrong_answer.slice(answer_count * 4, (answer_count + 1) * 4)]
          let pilgan_answers = answers.map((ans, index_ans) => {
            let answer_img = filteredData.filter(item => {
              return item.fieldname == `answer_image_${index}${index_ans}`
            })
            return {
              index: index_ans,
              answer: ans,
              image: answer_img.length !== 0 ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                answer_img[0].filename
              }` : null
            }
          })
          answer_count += 1;

          const question = await Question.create({
            question_text: question_text[index],
            question_img: img,
            pilgan_answers: JSON.stringify(pilgan_answers),
            question_type: question_type[index],
          });
          exam.addQuestions(question);
        } else if (question_type[index] == "kartu") {
          let img = "";
          if (question_with_img.includes(index.toString())) {
            img = `${req.protocol + "://" + req.get("host")}/files/uploads/${
              req.files[count].filename
            }`;
            count += 1;
          } else {
            img = null;
          }

          let new_card_answer = card_answers[card_answer_index];
          card_answer_index += 1;
          let stringify_card_answer = JSON.stringify(new_card_answer);
          const question = await Question.create({
            question_text: question_text[index],
            question_img: img,
            question_type: question_type[index],
            card_answers: stringify_card_answer,
          });
          exam.addQuestions(question);
        }
      });
      exam.addScores(score);
    } else {
      if (question_type == "pilihan_ganda") {
        // // -----------ANSWER IMAGE HANDLE-----------
        let filteredData = req.files.filter((item, idx) => {
          return item.fieldname.startsWith("answer_image_")
        });
        
        const question_image = req.files.filter(
          (item) => item.fieldname === `question_img`
        );

        let answers = [correct_answer, ...req.body.wrong_answer]
        let pilgan_answers = answers.map((ans,index) => {
          let answer_img = filteredData.filter(item => {
            return item.fieldname == `answer_image_0${index}`
          })
          return {
            index,
            answer: ans,
            image: answer_img.length !== 0 ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
              answer_img[0].filename
            }` : null
          }
        })

        // ----------END HANDLE---------------
        pilgan_answers = JSON.stringify(pilgan_answers);
        const question = await Question.create({
          question_text,
          question_img:
            question_image.length !== 0
              ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                  question_image[0].filename
                }`
              : null,
          pilgan_answers,
          question_type,
        });
        exam.addQuestions(question);
        exam.addScores(score);
      } else if (question_type == "kartu") {
        card_answers = JSON.stringify(card_answers[0]);
        const question = await Question.create({
          question_text,
          question_img:
            req.files[0] !== undefined
              ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                  req.files[0].filename
                }`
              : null,
          card_answers,
          question_type,
        });
        exam.addQuestions(question);
        exam.addScores(score);
      }
    }
    return response(200, "success create new exam", [], res);
  } catch (error) {
    response(
      500,
      "server failed to add new exam",
      { error: error.message },
      res
    );
  }
}

async function updateExam(req, res) {
  try {
    let {
      exam_type,
      exam_name,
      kkm_point,
      available_try,
      question_text,
      correct_answer,
      question_type,
      card_answers,
    } = req.body;

    let card_answer_index = 0;
    card_answers = JSON.parse(card_answers);
    let question_id = req.body.question_unique_id.split(",");
    const exam = await Exam.findOne({
      where: {
        unique_id: req.body.exam_unique_id,
      },
    });
    if (!exam) return response(400, "exam not found", [], res);
    await Exam.update(
      {
        exam_name: exam_name !== null ? exam_name : exam.exam_name,
        exam_type: exam_type !== null ? exam_type : exam.exam_type,
        kkm_point: kkm_point !== null ? kkm_point : exam.kkm_point,
        available_try:
          available_try !== null ? available_try : exam.available_try,
      },
      {
        where: {
          unique_id: req.body.exam_unique_id,
        },
      }
    );
    // ASSIGN SISWA
    let exam_unique_id = req.body.exam_unique_id;
    let siswa_on = Object.keys(req.body).filter((key) => {
      return req.body[key] === "on";
    });
    let siswa_off = Object.keys(req.body).filter((key) => {
      return req.body[key] === "off";
    });
    siswa_on.forEach(async (siswa_id) => {
      let exam = await Exam.findByPk(exam_unique_id);
      let user = await Score.findByPk(siswa_id);
      if (!(await exam.hasScore(user))) {
        await exam.addScore(user);
      }
    });
    siswa_off.forEach(async (siswa_id) => {
      let exam = await Exam.findByPk(exam_unique_id);
      let user = await Score.findByPk(siswa_id);
      if (await exam.hasScore(user)) {
        await exam.removeScore(user);
      }
    });

    // UPDATE QUESTION
    // IF QUESTION > 1
    if (Array.isArray(question_text)) {
      question_type = question_type.split(',')
      let question_with_img = req.body.index_deleted.split(",");
      let count = 0;
      let answer_count = 0;
      const bulkNewBody = await Promise.all(
        question_id.map(async (quest_id, index) => {
          const question_image = req.files.filter(
            (item) => item.fieldname === `question_img`
          );
          let img = "";
          if (question_with_img.includes(index.toString())) {
            img = `${req.protocol + "://" + req.get("host")}/files/uploads/${
              question_image[count].filename
            }`;
            count += 1;
          } else {
            img = null;
          }

          if (question_type[index] === "pilihan_ganda") {
            // HANDLE IMAGE
            const filteredData = req.files.filter((item,idx) =>{
              return item.fieldname.startsWith("answer_image_")
            });

            let answers = [correct_answer[answer_count], ...req.body.wrong_answer.slice(answer_count * 4, (answer_count + 1) * 4)]
            let pilgan_answers = answers.map((ans, index_ans) => {
              let answer_img = filteredData.filter(item => {
                return item.fieldname == `answer_image_${index}${index_ans}`
              })
              return {
                index: index_ans,
                answer: ans,
                image: answer_img.length !== 0 ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                  answer_img[0].filename
                }` : null
              }
            })
            console.log(pilgan_answers);
            answer_count += 1;

            return {
              question_text: question_text[index],
              question_img: img,
              pilgan_answers: JSON.stringify(pilgan_answers),
              question_type: question_type[index],
            };
          } else if (question_type[index] == "kartu") {
            let newCradAnswers = JSON.stringify(
              card_answers[card_answer_index]
            );
            card_answer_index += 1;
            return (newBody = {
              question_text: question_text[index],
              question_img: img,
              card_answers: newCradAnswers,
              question_type: question_type[index],
            });
          }
        })
      );

      console.log(bulkNewBody);

      await Question.bulkCreate(bulkNewBody, {
        updateOnDuplicate: ["unique_id"],
      }).then(async (result) => {
        exam.setQuestions(result);
        await Question.destroy({
          where: {
            unique_id: question_id,
          },
        });
      });

      // IF QUESTION == 1
    } else {
      if (question_type == "pilihan_ganda") {
        // // -----------ANSWER IMAGE HANDLE-----------
        const filteredData = req.files.filter(
          (item) => item.fieldname.startsWith("answer_image_")
        );
        const question_image = req.files.filter(
          (item) => item.fieldname === `question_img`
        );

        let answers = [correct_answer, ...req.body.wrong_answer]
        let pilgan_answers = answers.map((ans,index) => {
          let answer_img = filteredData.filter(item => {
            return item.fieldname == `answer_image_0${index}`
          })
          return {
            index,
            answer: ans,
            image: answer_img[0] !== undefined ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
              answer_img[0].filename
            }` : null
          }
        })
        // ----------END HANDLE---------------
        pilgan_answers = JSON.stringify(pilgan_answers);
        console.log(question_id);
        await Question.update({
          question_text,
          question_img:
            question_image[0] !== undefined
              ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                  question_image[0].filename
                }`
              : null,
          pilgan_answers,
          question_type,
        }, {
          where: {
            unique_id: question_id,
          },
        })
          .then(() => {
            return Question.findOne({ where: { unique_id: question_id } });
          })
          .then((result) => {
            exam.setQuestions(result);
          })
      } else if (question_type == "kartu") {
        card_answers = JSON.stringify(card_answers);
        let newBody = {
          question_text,
          question_img:
            req.files[0] !== undefined
              ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                  req.files[0].filename
                }`
              : null,
          question_type,
          card_answers,
        };
        await Question.update(newBody, {
          where: {
            unique_id: question_id,
          },
        })
          .then(() => {
            return Question.findOne({ where: { unique_id: question_id } });
          })
          .then((result) => {
            exam.setQuestions(result);
          });
      }
    }
    response(200, "updated exams success", [], res);
  } catch (error) {
    response(
      500,
      "server failed to update the exam",
      { error: error.message },
      res
    );
  }
}

async function getAllExam(req, res, next) {
  try {
    const exams = await Exam.findAll({
      order: [["createdAt"], [Question, "createdAt"]],
      include: [
        {
          model: Question,
          attributes: {
            exclude: ["ExamUniqueId", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    response(200, "get all exam data", exams, res);
  } catch (error) {
    response(500, "server error get all exam", { error: error.message }, res);
  }
}

async function deleteExam(req, res, next) {
  try {
    if (!req.body.exam_unique_id)
      return response(400, "body can't be undefined", [], res);

    // FIND USER AND DELETE
    const exams = await Exam.destroy({
      where: {
        unique_id: req.body.exam_unique_id,
      },
    });

    // CHECK IF USER IS NOT FOUND
    if (!exams)
      return response(
        400,
        "cant find user with id:" + req.body.exam_unique_id,
        [],
        res
      );
    response(200, "delete exam success", exams, res);
  } catch (error) {
    response(500, "server failed delete exam", { error: error.message }, res);
  }
}

async function getExamById(req, res, next) {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [[Question, "question_img"]],
      include: [
        {
          model: Question,
          attributes: { exclude: ["ExamUniqueId", "createdAt", "updatedAt"] },
        },
      ],
    });
    if (!exam)
      return response(200, `no exam found with id: ${req.params.id}`, [], res);
    return response(200, "get all exam data", exam, res);
  } catch (error) {
    response(
      500,
      "server failed get exam by id",
      { error: error.message },
      res
    );
  }
}

module.exports = {
  getAllExam,
  tambahExam,
  getExamById,
  updateExam,
  deleteExam,
};
