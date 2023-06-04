const { Exam, Score, Question, ScoreExam } = require("../models");
const response = require("./response");

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
      question_text.forEach(async (qt, index) => {
        wrong_answer = req.body.wrong_answer
          .slice(index * 4, (index + 1) * 4)
          .join();
        const question = await Question.create({
          question_text: question_text[index],
          question_img:
            req.files[index] !== undefined
              ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                  req.files[index].filename
                }`
              : null,
          correct_answer: correct_answer[index],
          wrong_answer: wrong_answer,
        });
        exam.addQuestions(question);
      });
      exam.addScores(score);
      return res.redirect("/ujian");
    } else {
      let wrong_answer = req.body.wrong_answer.join();
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
      return res.redirect("/ujian");
    }
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
    question_id.forEach(async (quest_id, index) => {
      const question = await Question.findOne({
        where: {
          unique_id: quest_id,
        },
      });
      if (Array.isArray(question_text)) {
        wrong_answer = req.body.wrong_answer
          .slice(index * 4, (index + 1) * 4)
          .join();
        await Question.update(
          {
            question_text: question_text[index],
            question_img:
              req.files[index] !== undefined
                ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                    req.files[index].filename
                  }`
                : question.question_img,
            correct_answer: correct_answer[index],
            wrong_answer: wrong_answer,
          },
          {
            where: {
              unique_id: quest_id,
            },
          }
        );
      } else {
        let wrong_answer = req.body.wrong_answer.join();
        await Question.update(
          {
            question_text,
            question_img:
              req.files[0] !== undefined
                ? `${req.protocol + "://" + req.get("host")}/files/uploads/${
                    req.files[0].filename
                  }`
                : question.question_img,
            correct_answer,
            wrong_answer,
          },
          {
            where: {
              unique_id: quest_id,
            },
          }
        );
      }
    });
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
