"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteExamType = exports.CreateExamType = exports.UpdateExamType = exports.GetExamTypeById = exports.GetAllExamType = void 0;
const ExamType_1 = __importDefault(require("../../models/ExamType"));
const response_1 = __importDefault(require("../response"));
async function GetAllExamType(req, res) {
    try {
        await ExamType_1.default.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        }).then((result) => {
            (0, response_1.default)(200, "success get all exam type", result, res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to get all exam type", { error: error.message }, res);
    }
}
exports.GetAllExamType = GetAllExamType;
async function GetExamTypeById(req, res) {
    try {
        const pk = req.params.id;
        await ExamType_1.default.findByPk(pk, {
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        }).then((result) => {
            (0, response_1.default)(200, "success get some exam topic", result, res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to get exam type", { error: error.message }, res);
    }
}
exports.GetExamTypeById = GetExamTypeById;
async function UpdateExamType(req, res) {
    try {
        const examTypeData = req.body;
        const examTypeId = req.params.id;
        let examType = await ExamType_1.default.findByPk(examTypeId);
        examType.update(examTypeData);
        (0, response_1.default)(200, "success update exam_type", [], res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to update exam type", { error: error.message }, res);
    }
}
exports.UpdateExamType = UpdateExamType;
async function CreateExamType(req, res) {
    try {
        const topikData = req.body;
        await ExamType_1.default.create(topikData).then(() => {
            (0, response_1.default)(201, "success create new exam_type", [], res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to create new exam_type", [], res);
    }
}
exports.CreateExamType = CreateExamType;
async function DeleteExamType(req, res) {
    try {
        let unique_id = req.body.unique_id;
        if (!unique_id)
            return (0, response_1.default)(400, "body cant be undefined", [], res);
        await ExamType_1.default.destroy({
            where: {
                unique_id,
            },
        }).then((respon) => {
            if (!respon)
                return (0, response_1.default)(400, "delete failed, exam_type not found", respon, res);
            return (0, response_1.default)(200, "success delete exam_type", respon, res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to delete admin", { error: error.message }, res);
    }
}
exports.DeleteExamType = DeleteExamType;
//# sourceMappingURL=examTypeController.js.map