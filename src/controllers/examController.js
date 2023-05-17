const { Exam, Score, Question, ScoreExam } = require("../models");
const response = require("./response");

Score.belongsToMany(Exam, {
  foreignKey: "score_id",
  through: ScoreExam,
});
Exam.belongsToMany(Score, {
  foreignKey: "exam_id",
  through: ScoreExam,
});

Exam.hasMany(Question);
Question.belongsTo(Exam);

async function tambahExam(req, res) {
  console.log(req.body);
  res.redirect("/ujian");
  // const {
  //   exam_type,
  //   kkm_point,
  //   available_try,
  //   question_text,
  //   answer,
  //   wrong_answer1,
  //   wrong_answer2,
  //   wrong_answer3,
  // } = req.body;

  // const score = await Score.findAll();
  // const exam = await Exam.create({
  //   exam_type,
  //   kkm_point,
  //   available_try,
  // });

  // if (Array.isArray(question_text)) {
  //   question_text.forEach(async (qt, index) => {
  //     const question = await Question.create({
  //       question_text: question_text[index],
  //       answer: answer[index],
  //       wrong_answer1: wrong_answer1[index],
  //       wrong_answer2: wrong_answer2[index],
  //       wrong_answer3: wrong_answer3[index],
  //     });
  //     exam.addQuestions(question);
  //     exam.addScores(score);
  //   });
  //   return res.redirect("http://localhost:3000/exams");
  // } else {
  //   const question = await Question.create({
  //     question_text,
  //     answer,
  //     wrong_answer1,
  //     wrong_answer2,
  //     wrong_answer3,
  //   });
  //   exam.addQuestions(question);
  //   exam.addScores(score);
  //   return res.redirect("http://localhost:3000/exams");
  // }
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
