import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import { CreateExamType, DeleteExamType, GetAllExamType, GetExamTypeById, UpdateExamType } from "../../controllers/v1/examTypeController";

const router = express.Router()

router.get("/", GetAllExamType);
router.get("/:id", GetExamTypeById);
router.post("/",validateTokenAPI, CreateExamType);
router.put("/:id",validateTokenAPI, UpdateExamType);
router.delete("/",validateTokenAPI, DeleteExamType);

export default router;
