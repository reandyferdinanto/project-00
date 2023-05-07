const { Score } = require("../models");

async function addScore(req, res) {
  const body = req.body;
  const newScore = await Score.create({
    unique_id: body.unique_id,
    username: body.username,
    class: body.class,
    point: body.point,
  });
  res.json({
    status: "New User Added",
    newScore,
  });
}

async function getAllScore(req, res, next) {
  const scores = await Score.findAll();
  res.json(scores);
}

async function getScoreByUsername(req, res, next) {
  const { username } = req.params;
  const score = await Score.findOne({
    where: {
      username: username,
    },
  });
  res.json(score);
}
module.exports = {
  addScore,
  getAllScore,
  getScoreByUsername,
};
