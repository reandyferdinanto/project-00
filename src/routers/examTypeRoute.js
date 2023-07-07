const router = require("express").Router();
const examTypeController = require("../controllers/examTypeController");
const { validateToken } = require("../utils/JWT");

router.get("/", examTypeController.getExamType);
router.get("/:id", examTypeController.getExamTypeById);
router.post("/", examTypeController.createExamType);

module.exports = router;
