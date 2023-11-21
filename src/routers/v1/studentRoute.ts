import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import { AddStudent, AuthStudent, DeleteUser, EditStudent, GetAllStudent, GetStudentById, UpdateStudentPoint } from "../../controllers/v1/studentController";

const router = express.Router()

router.get("/", GetAllStudent);
router.get("/:id", GetStudentById);
router.post("/", validateTokenAPI, AddStudent);
router.post("/edit", validateTokenAPI, EditStudent);
// // no need validate token cause it used for game
router.post("/auth", AuthStudent);
// no need validate token cause it used for game
router.put("/:id", UpdateStudentPoint);
router.delete("/", validateTokenAPI, DeleteUser);

export default router
