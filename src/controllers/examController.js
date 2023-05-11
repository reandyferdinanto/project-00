const { Exam, Score, Question } = require("../models");
const response = require("./response");

Score.belongsToMany(Exam, {
  foreignKey: "score_id",
  through: "scoreexam",
});
Exam.belongsToMany(Score, {
  foreignKey: "exam_id",
  through: "scoreexam",
});

Exam.hasMany(Question);
Question.belongsTo(Exam);

async function tambahExam(req, res) {
  const {
    exam_type,
    kkm_point,
    available_try,
    question_text,
    answer,
    wrong_answer1,
    wrong_answer2,
    wrong_answer3,
  } = req.body;
  const score = await Score.findAll();
  const exam = await Exam.create({
    exam_type,
    kkm_point,
    available_try,
  });

  const question = await Question.create({
    question_text,
    answer,
    wrong_answer1,
    wrong_answer2,
    wrong_answer3,
  });
  exam.addQuestions(question);
  exam.addScores(score);
  // response(201, "success add new exam", exam, res);
  res.redirect("http://localhost:3000/exams");
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

module.exports = {
  getAllExam,
  tambahExam,
};
