"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../../utils/JWT");
const studentController_1 = require("../../controllers/v1/studentController");
const router = express_1.default.Router();
router.get("/", studentController_1.GetAllStudent);
router.get("/:id", studentController_1.GetStudentById);
router.post("/", JWT_1.validateTokenAPI, studentController_1.AddStudent);
// // no need validate token cause it used for game
router.post("/auth", studentController_1.AuthStudent);
// no need validate token cause it used for game
router.put("/:id", JWT_1.validateTokenAPI, studentController_1.EditStudent);
router.put("/:id/point", studentController_1.UpdateStudentPoint);
router.delete("/", JWT_1.validateTokenAPI, studentController_1.DeleteUser);
exports.default = router;
//# sourceMappingURL=studentRoute.js.map