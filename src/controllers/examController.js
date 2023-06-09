const { Exam, Score, Question, ScoreExam } = require("../models");
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
    } = req.body;

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
      question_text.forEach(async (qt, index) => {
        let wrong_answer = req.body.wrong_answer
          .slice(index * 4, (index + 1) * 4)
          .join("|");
        let img = "";
        if (question_with_img.includes(index.toString())) {
          img = `${req.protocol + "://" + req.get("host")}/files/uploads/${
            req.files[count].filename
          }`;
          count += 1;
        } else {
          img = null;
        }

        const question = await Question.create({
          question_text: question_text[index],
          question_img: img,
          correct_answer: correct_answer[index],
          wrong_answer: wrong_answer,
        });
        exam.addQuestions(question);
      });
      exam.addScores(score);
    } else {
      let wrong_answer = req.body.wrong_answer.join("|");
      const question = await Question.create({
        question_text,
        question_img:
          req.files[0] !== undefined
            ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                req.files[0].filename
              }`
            : null,
        correct_answer,
        wrong_answer,
      });
      exam.addQuestions(question);
      exam.addScores(score);
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
    } = req.body;
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

    // UPDATE QUESTION
    // IF QUESTION > 1
    if (Array.isArray(question_text)) {
      let question_with_img = req.body.index_deleted.split(",");
      let count = 0;
      let bulkNewBody = [];
      for (const [index, quest_id] of question_id.entries()) {
        let wrong_answer = req.body.wrong_answer
          .slice(index * 4, (index + 1) * 4)
          .join("|");
        let img = "";
        if (question_with_img.includes(index.toString())) {
          img = `${req.protocol + "://" + req.get("host")}/files/uploads/${
            req.files[count].filename
          }`;
          count += 1;
        } else {
          img = null;
        }

        await Question.findOne({
          where: {
            unique_id: quest_id,
          },
        })
          .then(() => {
            return (newBody = {
              question_text: question_text[index],
              question_img: img,
              correct_answer: correct_answer[index],
              wrong_answer: wrong_answer,
            });
          })
          .then((newBody) => {
            bulkNewBody.push(newBody);
          });
      }

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
      const question = await Question.findOne({
        where: {
          unique_id: question_id,
        },
      });
      let wrong_answer = req.body.wrong_answer.join("|");
      let newBody = {
        question_text,
        question_img:
          req.files[0] !== undefined
            ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                req.files[0].filename
              }`
            : null,
        correct_answer,
        wrong_answer,
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
      order: [["createdAt"]],
      include: [
        {
          model: Question,
          attributes: { exclude: ["ExamUniqueId", "examId"] },
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
      include: [
        {
          model: Question,
          attributes: { exclude: ["ExamUniqueId"] },
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
