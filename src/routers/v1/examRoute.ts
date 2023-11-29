import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import { AddExam, DeleteExam, GetAllExam, GetExamById, UpdateExam } from "../../controllers/v1/examController";

const router = express.Router()

router.get("/", GetAllExam);
router.get("/:id", GetExamById);
router.post("/", validateTokenAPI, AddExam);
router.put("/:id", validateTokenAPI, UpdateExam);
router.delete("/:id", validateTokenAPI, DeleteExam);

export default router;
