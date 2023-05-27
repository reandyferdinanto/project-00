const router = require("express").Router();
const examController = require("../controllers/examController");
const { validateToken } = require("../utils/JWT");

router.get("/", examController.getAllExam);
router.get("/:type", examController.getExamByType);
router.post("/", validateToken, examController.tambahExam);

module.exports = router;
