const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    postman_docs: "https://documenter.getpostman.com/view/17399437/2s93eYTrCu",
    swagger_docs: "https://muslim-maya-production.up.railway.app/api-docs",
  });
});

module.exports = router;
