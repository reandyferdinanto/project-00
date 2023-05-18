const router = require("express").Router();
const examController = require("../controllers/examController");

router.get("/", examController.getAllExam);
router.get("/:type", examController.getExamByType);
router.post("/", examController.tambahExam);

module.exports = router;
