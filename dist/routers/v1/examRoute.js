"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../../utils/JWT");
const examController_1 = require("../../controllers/v1/examController");
const router = express_1.default.Router();
router.get("/", examController_1.GetAllExam);
router.get("/:id", examController_1.GetExamById);
router.post("/", JWT_1.validateTokenAPI, examController_1.AddExam);
router.put("/:id", JWT_1.validateTokenAPI, examController_1.UpdateExam);
router.delete("/:id", JWT_1.validateTokenAPI, examController_1.DeleteExam);
exports.default = router;
//# sourceMappingURL=examRoute.js.map