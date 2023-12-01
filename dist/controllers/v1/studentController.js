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
const GetAllStudent = async (req, res, next) => {
    try {
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
    let { nis, password } = req.body;
    try {
        let data;
        await Student_1.default.findOne({
            where: {
                nis,
            },
        }).then(result => {
            if (result) {
                data = {
                    unique_id: result.unique_id,
                    username: result.username,
                    nis: result.nis,
                    class: result.class,
                    major: result.major,
                    role: result.role
                };
                if (result.password == password) {
                    return res.json({
                        ResultCode: 1,
                        UserId: result.unique_id,
                        Data: data,
                    });
                }
                else {
                    return res.json({
                        ResultCode: 2,
                        Message: "NIS and Password combination didn't match.",
                        Status: "failed",
                    });
                }
            }
            else {
                Admin_1.default.findOne({
                    where: {
                        nuptk: nis
                    }
                }).then(hasil => {
                    if (hasil) {
                        data = {
                            unique_id: hasil.unique_id,
                            username: hasil.username,
                            role: hasil.role,
                            email: hasil.email,
                        };
                        bcrypt_1.default.compare(password, hasil.password, function (err, match) {
                            if (err) {
                                return res.json({
                                    ResultCode: 2,
                                    Message: err,
                                    Status: "failed",
                                });
                            }
                            if (match) {
                                return res.json({
                                    ResultCode: 1,
                                    UserId: hasil.unique_id,
                                    Data: data,
                                });
                            }
                            else if (!match) {
                                return res.json({
                                    ResultCode: 2,
                                    Message: "NUPTK and Password combination didn't match.",
                                    Status: "failed",
                                });
                            }
                        });
                    }
                    else {
                        return res.json({
                            ResultCode: 2,
                            Message: "All user not found.",
                            Status: "failed",
                        });
                    }
                });
            }
        });
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