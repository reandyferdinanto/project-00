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
      correct_answer,
      wrong_answer,
    });
    exam.addQuestions(question);
    exam.addScores(score);
    return res.redirect("/ujian");
  }
}

async function getAllExam(req, res, next) {
  const exams = await Exam.findAll({
    include: [
      {
        model: Question,
        attributes: { exclude: ["ExamUniqueId"] },
      },
    ],
  });
  response(200, "get all exam data", exams, res);
}

async function getExamByType(req, res, next) {
  const exams = await Exam.findOne({
    where: {
      exam_type: req.params.type,
    },
    include: [
      {
        model: Question,
        attributes: { exclude: ["ExamUniqueId"] },
      },
    ],
  });
  response(200, "get all exam data", exams, res);
}

module.exports = {
  getAllExam,
  tambahExam,
  getExamByType,
};
