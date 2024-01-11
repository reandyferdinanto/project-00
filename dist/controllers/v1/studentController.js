"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStudent = exports.EditStudent = exports.DeleteUser = exports.UpdateStudentPoint = exports.AddStudent = exports.GetStudentById = exports.GetAllStudent = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const response_1 = __importDefault(require("../response"));
const Exam_1 = __importDefault(require("../../models/Exam"));
const Student_1 = __importDefault(require("../../models/Student"));
const StudentExam_1 = __importDefault(require("../../models/StudentExam"));
const Admin_1 = __importDefault(require("../../models/Admin"));
const Metric_1 = __importDefault(require("../../models/Metric"));
const MetricSchool_1 = __importDefault(require("../../models/MetricSchool"));
const JWT_1 = require("../../utils/JWT");
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
require("dotenv").config({ path: path_1.default.resolve(__dirname + "/./../../../.env") });
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "SECRET";
const GetAllStudent = async (req, res, next) => {
    try {
        let studentQuery = req.query;
        if (Object.keys(studentQuery).length !== 0) {
            let students = await Student_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                    { model: Exam_1.default, attributes: { exclude: ["createdAt", "updatedAt"] },
                        through: {
                            attributes: { exclude: ["createdAt", "updatedAt"] }
                        }
                    },
                ],
                order: ["nis"]
            });
            return (0, response_1.default)(200, "showing all students", students, res);
        }
        let students = await Student_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                { model: Exam_1.default, attributes: { exclude: ["createdAt", "updatedAt"] },
                    through: {
                        attributes: { exclude: ["createdAt", "updatedAt"] }
                    }
                },
            ],
            order: ["nis"]
        });
        return (0, response_1.default)(200, "showing all students", students, res);
    }
    catch (error) {
        return (0, response_1.default)(500, "server failed to get all user", { error: error.message }, res);
    }
};
exports.GetAllStudent = GetAllStudent;
const GetStudentById = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student_1.default.findByPk(studentId, { attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                { model: Exam_1.default, attributes: { exclude: ["createdAt", "updatedAt"] }, },
            ] });
        if (student) {
            (0, response_1.default)(200, "showing student data by ID", student, res);
        }
        else {
            return (0, response_1.default)(400, "user not found", [], res);
        }
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to get user", { error: error.message }, res);
    }
};
exports.GetStudentById = GetStudentById;
const AddStudent = async (req, res) => {
    try {
        let studentData = req.body;
        studentData.nis = studentData.school_id + studentData.nis;
        studentData.password = studentData.nis + "##";
        studentData.role = "siswa";
        const newStudents = await Student_1.default.create(studentData);
        const METRIC = await Metric_1.default.findOne();
        const METRICSCHOOL = await MetricSchool_1.default.findOne({ where: { school_id: studentData.school_id } });
        METRIC.update({ total_student: METRIC.total_student + 1 });
        METRIC.hasMetric_school(METRICSCHOOL).then(async (isHas) => {
            if (!isHas) {
                let NEW_METRICSCHOOL = await MetricSchool_1.default.create({
                    student_counter: 1,
                    school_id: studentData.school_id,
                    school_name: studentData.school_name
                });
                METRIC.addMetric_school(NEW_METRICSCHOOL);
            }
            else {
                METRICSCHOOL.update({
                    student_counter: METRICSCHOOL.student_counter + 1
                });
            }
        });
        (0, response_1.default)(201, "add new Students", newStudents, res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to create new Students", { error: error.message }, res);
    }
};
exports.AddStudent = AddStudent;
const UpdateStudentPoint = async (req, res) => {
    try {
        const { point, exam_id } = req.body;
        const { id } = req.params;
        let new_point = [];
        if (id == undefined || exam_id == undefined)
            return (0, response_1.default)(400, "id or exam_id cannot be undefined", { error: "id or exam_id undefined" }, res);
        await StudentExam_1.default.findOne({ where: { score_id: id, exam_id: exam_id }, })
            .then((prev) => {
            if (prev.point) {
                new_point = JSON.parse(prev.point);
                new_point.push({ attemp: new_point.length + 1, point });
            }
            else {
                new_point.push({ attemp: 1, point });
            }
            StudentExam_1.default.update({ point: JSON.stringify(new_point), number_of_try: prev.number_of_try + 1 }, { where: { score_id: id, exam_id: exam_id },
            })
                .then(() => {
                return (0, response_1.default)(200, "success updated user point", [], res);
            });
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to update point", { error: error.message }, res);
    }
};
exports.UpdateStudentPoint = UpdateStudentPoint;
const DeleteUser = async (req, res) => {
    try {
        let checkedSiswa = req.body.checkedSiswa;
        if (!checkedSiswa)
            return (0, response_1.default)(400, "body cant be undefined", [], res);
        await Student_1.default.destroy({
            where: {
                unique_id: checkedSiswa,
            },
        }).then((respon) => {
            if (!respon)
                return (0, response_1.default)(400, "delete failed, user not found", respon, res);
            return (0, response_1.default)(200, "success delete user", respon, res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to delete user", { error: error.message }, res);
    }
};
exports.DeleteUser = DeleteUser;
const EditStudent = async (req, res) => {
    try {
        let studentId = req.params.id;
        let studentData = req.body;
        // User update
        const user = await Student_1.default.findByPk(studentId);
        if (!user)
            return (0, response_1.default)(400, "user not found", [], res);
        if (studentData.nis !== undefined)
            studentData.nis = user.school_id + studentData.nis;
        user.update(studentData);
        let exams_on = Object.keys(studentData).filter((key) => {
            return studentData[key] === "on";
        });
        let exams_off = Object.keys(studentData).filter((key) => {
            return studentData[key] === "off";
        });
        exams_on.forEach(async (exam_id) => {
            let exam = await Exam_1.default.findByPk(exam_id);
            if (!(await exam.hasStudent(user))) {
                await exam.addStudent(user);
            }
        });
        exams_off.forEach(async (exam_id) => {
            let exam = await Exam_1.default.findByPk(exam_id);
            if (await exam.hasStudent(user)) {
                await exam.removeStudent(user);
            }
        });
        (0, response_1.default)(200, "success update user", user, res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to update user", { error: error.message }, res);
    }
};
exports.EditStudent = EditStudent;
const AuthStudent = async (req, res) => {
    let nis = req.body.nis ? req.body.nis : "";
    let password = req.body.password ? req.body.password : "";
    let token = req.body.token ? req.body.token : null;
    try {
        let data;
        let studentLogin = await Student_1.default.findOne({ where: { nis }, raw: true, attributes: { exclude: ["createdAt", "updatedAt"] } });
        let adminLogin = await Admin_1.default.findOne({ where: { nuptk: nis }, raw: true, attributes: { exclude: ["createdAt", "updatedAt"] } });
        // if token expired or not login
        if (token) {
            try {
                return (0, jsonwebtoken_1.verify)(token, ACCESS_TOKEN_SECRET, function (err, user) {
                    if (err) {
                        return res.json({
                            ResultCode: 2,
                            Message: { error: err.message },
                            Status: "failed",
                        });
                    }
                    else {
                        return res.json({
                            ResultCode: 1,
                            UserId: user.unique_id,
                            Data: user,
                        });
                    }
                });
            }
            catch (error) {
                return (0, response_1.default)(500, "server error", { error: error.message }, res);
            }
        }
        // User not found !
        if (!studentLogin && !adminLogin) {
            res.json({
                ResultCode: 2,
                Message: "User not found.",
                Status: "failed",
            });
        }
        if (studentLogin) {
            if (password == studentLogin.password) {
                const accessToken = (0, JWT_1.generateInGameAccessToken)(studentLogin);
                data = studentLogin;
                data['token'] = accessToken;
                res.json({
                    ResultCode: 1,
                    UserId: data.unique_id,
                    Data: data,
                });
            }
            else {
                // Nis Password Not Match !
                res.json({
                    ResultCode: 2,
                    Message: "NIS and Password combination didn't match.",
                    Status: "failed",
                });
            }
        }
        if (adminLogin) {
            let passwordCorrect = await bcrypt_1.default.compare(password, adminLogin.password);
            if (passwordCorrect) {
                const accessToken = (0, JWT_1.generateInGameAccessToken)(adminLogin);
                data = adminLogin;
                data['token'] = accessToken;
                res.json({
                    ResultCode: 1,
                    UserId: adminLogin.unique_id,
                    Data: adminLogin,
                });
            }
            else {
                // Nis Password not Match
                res.json({
                    ResultCode: 2,
                    Message: "NIS and Password combination didn't match.",
                    Status: "failed",
                });
            }
        }
        if (data !== undefined) {
            const METRIC = await Metric_1.default.findOne();
            const METRICSCHOOL = await MetricSchool_1.default.findOne({ where: { school_id: data.school_id } });
            METRIC.update({ total_login: METRIC.total_login + 1 });
            METRIC.hasMetric_school(METRICSCHOOL).then(async (isHas) => {
                if (!isHas) {
                    let NEW_METRICSCHOOL = await MetricSchool_1.default.create({
                        login_counter: 1,
                        school_id: data.school_id,
                        school_name: data.school_name
                    });
                    METRIC.addMetric_school(NEW_METRICSCHOOL);
                }
                else {
                    METRICSCHOOL.update({
                        login_counter: METRICSCHOOL.login_counter + 1
                    });
                }
            });
        }
    }
    catch (error) {
        res.json({
            ResultCode: 2,
            Message: { error: error.message },
            Status: "failed",
        });
    }
};
exports.AuthStudent = AuthStudent;
//# sourceMappingURL=studentController.js.map