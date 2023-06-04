const fs = require("fs");
const path = require("path");
const { Admin } = require("../models");
const response = require("./response");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/JWT");

function register(req, res) {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Admin.create({
      username,
      password: hash,
    }).then(() => {
      res.json("USER REGISTERED");
    });
  });
}

async function login(req, res) {
  const { username, password } = req.body;
  const admin = await Admin.findOne({
    where: {
      username: username,
    },
  });
  if (admin == null) {
    return res.json({ error: "user not found" });
  }
  const dbPassword = admin.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res
        // .status(400)
        .json({ error: "wrong username and password combination" });
    } else {
      const accessToken = createToken(admin);
      res.cookie("access-token", accessToken, {
        maxAge: 3600000,
      });
      res.status(200).json({ message: "LOGEDIN" });
    }
  });
}

async function logout(req, res, next) {
  res.clearCookie("access-token");
  res.redirect("/login");
}

module.exports = {
  register,
  login,
  logout,
};
