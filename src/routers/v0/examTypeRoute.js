const router = require("express").Router();
const examTypeController = require("../../controllers/v0/examTypeController");
const { validateToken } = require("../../utils/JWT");

router.get("/", examTypeController.getExamType);
router.get("/:id", examTypeController.getExamTypeById);
router.post("/", examTypeController.createExamType);
router.put("/", examTypeController.updateExamType);
router.delete("/", examTypeController.deleteExamType);

module.exports = router;
