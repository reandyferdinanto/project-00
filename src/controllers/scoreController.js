const { Score, Exam, Question } = require("../models");
const response = require("./response");

async function getScoreById(req, res, next) {
  const { id } = req.params;
  const score = await Score.findByPk(id, {
    // attributes: ["creataedAt", "updatedAt"],
    include: [
      {
        model: Exam,
        include: [
          {
            model: Question,
            attributes: { exclude: ["ExamUniqueId"] },
          },
        ],
        through: {
          attributes: ["point", "remedial_point"],
        },
      },
    ],
  });
  response(200, "get score by username", score, res);
}

async function getAllScore(req, res, next) {
  let score = await Score.findAll({
    include: [
      {
        model: Exam,
        // attributes: ["unique_id"],
        through: {
          attributes: ["point", "remedial_point"],
        },
      },
    ],
    order: [[Exam, "createdAt"]],
  });
  return response(200, "get all scores", score, res);
}

async function updatePoint(req, res) {
  const { point, remedial_point } = req.body;
  const { username } = req.params;

  const user = await Score.findOne({
    where: {
      username: username,
    },
  });
  console.log(user.number_of_try);
  let number_of_try = user.number_of_try + 1;

  const updatedUser = await Score.update(
    {
      point: point || user.point,
      remedial_point: remedial_point || user.remedial_point,
      number_of_try: number_of_try || user.number_of_try,
    },
    {
      where: {
        username: username,
      },
    }
  );

  response(203, "point updated", [], res);
}

module.exports = {
  getAllScore,
  getScoreById,
  updatePoint,
};
