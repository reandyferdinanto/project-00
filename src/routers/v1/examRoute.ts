import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import { AddExam, DeleteExam, GetAllExam, GetExamById } from "../../controllers/v1/examController";

const router = express.Router()

router.get("/", GetAllExam);
router.get("/:id", GetExamById);
router.post("/", validateTokenAPI, AddExam);
// router.put("/", validateTokenAPI, examController.updateExam);
router.delete("/", validateTokenAPI, DeleteExam);

export default router;
