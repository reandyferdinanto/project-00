const { Score } = require("../models");
const response = require("./response");

async function addUser(req, res) {
  const body = req.body;
  const newUser = await Score.create({
    username: body.username,
    class: body.class,
  });
  response(201, "add new user", newUser, res);
}

module.exports = {
  addUser,
};
