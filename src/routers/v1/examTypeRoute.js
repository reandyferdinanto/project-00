const router = require("express").Router();
const examTypeController = require("../../controllers/v1/examTypeController");
const { validateTokenAPI } = require("../../utils/JWT");

router.get("/", examTypeController.getExamType);
router.get("/:id", examTypeController.getExamTypeById);
router.post("/",validateTokenAPI, examTypeController.createExamType);
router.put("/",validateTokenAPI, examTypeController.updateExamType);
router.delete("/",validateTokenAPI, examTypeController.deleteExamType);

module.exports = router;
