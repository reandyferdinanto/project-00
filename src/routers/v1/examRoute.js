const router = require("express").Router();
const examController = require("../../controllers/v1/examController");
const { validateTokenAPI } = require("../../utils/JWT");

router.get("/", examController.getAllExam);
router.get("/:id", examController.getExamById);
router.post("/", validateTokenAPI, examController.tambahExam);
router.put("/", validateTokenAPI, examController.updateExam);
router.delete("/", validateTokenAPI, examController.deleteExam);

module.exports = router;
