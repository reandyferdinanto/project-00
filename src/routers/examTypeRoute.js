const router = require("express").Router();
const examController = require("../controllers/examController");
const { validateToken } = require("../utils/JWT");

router.get("/", examController.getExamType);

module.exports = router;
