"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../../utils/JWT");
const examTypeController_1 = require("../../controllers/v1/examTypeController");
const router = express_1.default.Router();
router.get("/", examTypeController_1.GetAllExamType);
router.get("/:id", examTypeController_1.GetExamTypeById);
router.post("/", JWT_1.validateTokenAPI, examTypeController_1.CreateExamType);
router.put("/:id", JWT_1.validateTokenAPI, examTypeController_1.UpdateExamType);
router.delete("/", JWT_1.validateTokenAPI, examTypeController_1.DeleteExamType);
exports.default = router;
//# sourceMappingURL=examTypeRoute.js.map