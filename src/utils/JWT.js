const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user.unique_id,
      username: user.username,
    },
    "SECRET"
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ error: "you're not authenticated" });
  }
  try {
    const validToken = verify(accessToken, "SECRET");
    req.user = validToken;
    if (validToken) {
      req.authenticate = true;
      next();
    }
  } catch (error) {
    return res.status(400).json({ error: err });
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
    return res.status(400).json({ error: err });
  }
};

module.exports = {
  createToken,
  validateToken,
  validateRedirect,
};
