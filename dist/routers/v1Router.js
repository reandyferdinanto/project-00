"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentRoute_1 = __importDefault(require("./v1/studentRoute"));
const utilsRoute_1 = __importDefault(require("./v1/utilsRoute"));
const examRoute_1 = __importDefault(require("./v1/examRoute"));
const adminRoute_1 = __importDefault(require("./v1/adminRoute"));
const examTypeRoute_1 = __importDefault(require("./v1/examTypeRoute"));
const schoolRoute_1 = __importDefault(require("./v1/schoolRoute"));
const indexRoute_1 = __importDefault(require("./indexRoute"));
const moduleRouter_1 = __importDefault(require("./v1/moduleRouter"));
const v1Router = express_1.default.Router();
v1Router.use("/", indexRoute_1.default);
v1Router.use("/students", studentRoute_1.default);
v1Router.use("/utils", utilsRoute_1.default);
v1Router.use("/exams", examRoute_1.default);
v1Router.use("/admins", adminRoute_1.default);
v1Router.use("/topic", examTypeRoute_1.default);
v1Router.use("/schools", schoolRoute_1.default);
v1Router.use("/modules", moduleRouter_1.default);
exports.default = v1Router;
//# sourceMappingURL=v1Router.js.map