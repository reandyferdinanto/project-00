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
  const score = await Score.findAll();
  const exam = await Exam.create();

  const question = await Question.create();
  exam.addQuestions(question);
  exam.addScores(score);
  res.json(score);
}

async function getAllExam(req, res, next) {
  const exams = await Exam.findAll({
    include: { all: true },
  });
  response(200, "get score by username", exams, res);
}

module.exports = {
  getAllExam,
  tambahExam,
};
