const { Score } = require("../models");
const response = require("./response");

async function addScore(req, res) {
  const body = req.body;
  const newScore = await Score.create({
    username: body.username,
    class: body.class,
    point: body.point,
  });
  response(200, "add new score", newScore, res);
}

async function getScoreByUsername(req, res, next) {
  const { username } = req.params;
  const score = await Score.findOne({
    where: {
      username: username,
    },
  });
  response(200, "get score by username", score, res);
}

async function getAllScore(req, res, next) {
  const { username } = req.query;
  let score = await Score.findOne({
    where: {
      username: username || "",
    },
  });

  if (!score) {
    score = await Score.findAll();
    return response(200, "get all scores", score, res);
  }
  response(200, "get score by username", score, res);
}

module.exports = {
  addScore,
  getAllScore,
  getScoreByUsername,
};
