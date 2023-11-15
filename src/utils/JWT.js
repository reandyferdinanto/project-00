const { sign, verify } = require("jsonwebtoken");
const response = require("../controllers/v0/response");
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname + "/./../../.env") });

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "SECRET"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "SECRET"

const generateAccessToken = (user) => {
  return accessToken = sign(
    {
      id: user.unique_id,
      username: user.username,
      school_name: user.school_name,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET
  );
};

const validateTokenAPI = (req, res, next) => {
  const accessToken = req.cookies["login-token"];
  if (!accessToken) return res.sendStatus(403)
  try {
    verify(accessToken, ACCESS_TOKEN_SECRET, function(err, user){
      if(err) return res.sendStatus(403)
      req.user = user
      next()
    });
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

const validateTokenWebiste = (req, res, next) => {
  const accessToken = req.cookies["login-token"];
  // if token expired or not login
  if (!accessToken) return res.redirect("/login")
  try {
    verify(accessToken, ACCESS_TOKEN_SECRET, function(err, user){
      if(err) return res.sendStatus(403)
      req.user = user
      next()
    });
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

module.exports = {
  generateAccessToken,
  validateTokenAPI,
  validateTokenWebiste
};
