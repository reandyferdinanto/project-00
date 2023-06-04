const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    postman_docs: "https://documenter.getpostman.com/view/17399437/2s93eYTrCu",
  });
});

module.exports = router;
