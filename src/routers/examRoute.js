const router = require("express").Router();
const examController = require("../controllers/examController");
const { validateToken } = require("../utils/JWT");

router.get("/", examController.getAllExam);
router.get("/:id", examController.getExamById);
router.post("/", validateToken, examController.tambahExam);
router.put("/", validateToken, examController.updateExam);
router.delete("/", validateToken, examController.deleteExam);

module.exports = router;
