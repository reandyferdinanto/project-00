const { sign, verify } = require("jsonwebtoken");
const response = require("../controllers/response");

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user.unique_id,
      username: user.username,
      role: user.role,
      school_name: user.school_name
    },
    "SECRET"
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return response(400, "you're not authenticated", [], res);
  }
  try {
    const validToken = verify(accessToken, "SECRET");
    req.user = validToken;
    if (validToken) {
      req.authenticate = true;
      next();
    }
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

const validateRedirect = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.redirect("/login");
  }
  try {
    const validToken = verify(accessToken, "SECRET");
    req.user = validToken;
    if (validToken) {
      req.authenticate = true;
      next();
    }
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

module.exports = {
  createToken,
  validateToken,
  validateRedirect,
};
