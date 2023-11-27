"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLoginStatus = exports.ExportCSV = exports.UploadCSV = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const response_1 = __importDefault(require("../response"));
const Student_1 = __importDefault(require("../../models/Student"));
const Exam_1 = __importDefault(require("../../models/Exam"));
const Admin_1 = __importDefault(require("../../models/Admin"));
const Metric_1 = __importDefault(require("../../models/Metric"));
const MetricSchool_1 = __importDefault(require("../../models/MetricSchool"));
const exceljs_1 = __importDefault(require("exceljs"));
let RowCount = 0;
async function UploadCSV(req, res) {
    const CORRECT_HEADER = ["username", "class", "nis", "major", "gender"];
    try {
        const filePath = path_1.default.join(__dirname, "..", "..", "..", "public", "files", "uploads", req.files[0].filename);
        fs_1.default.createReadStream(filePath).pipe((0, csv_parser_1.default)())
            .on("data", async (row) => {
            let input_header = Object.keys(row);
            const sortedInputHeader = input_header.slice().sort();
            const sortedCorrectHeader = CORRECT_HEADER.slice().sort();
            if (JSON.stringify(sortedInputHeader) !== JSON.stringify(sortedCorrectHeader)) {
                throw Error(`Header dari csv harus berupa "username", "class", "nis", "major", "gender"`);
            }
            row.nis = req.body.school_id + row.nis;
            row.password = row.nis + "##";
            row.role = "siswa";
            row.school_id = req.body.school_id;
            row.school_name = req.body.school_name;
            RowCount += 1;
            await Student_1.default.create(row);
        })
            .on("error", e => (0, response_1.default)(400, e.message, [], res))
            .on("end", async () => {
            if (fs_1.default.existsSync(filePath)) {
                try {
                    fs_1.default.unlinkSync(filePath);
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                console.log("File not found");
            }
            const METRIC = await Metric_1.default.findOne();
            const METRICSCHOOL = await MetricSchool_1.default.findOne({ where: { school_id: req.body.school_id } });
            await METRIC.update({ total_student: METRIC.total_student + RowCount });
            const isHas = await METRIC.hasMetric_school(METRICSCHOOL);
            if (!isHas) {
                let NEW_METRICSCHOOL = await MetricSchool_1.default.create({
                    student_counter: RowCount,
                    school_id: req.body.school_id,
                    school_name: req.body.school_name
                });
                await METRIC.addMetric_school(NEW_METRICSCHOOL);
            }
            else {
                await METRICSCHOOL.update({
                    student_counter: METRICSCHOOL.student_counter + RowCount
                });
            }
            return (0, response_1.default)(201, "add new user", [], res);
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}
exports.UploadCSV = UploadCSV;
async function ExportCSV(req, res) {
    const userData = [];
    const users = await Student_1.default.findAll({ where: { school_id: req.body.school_id }, include: Exam_1.default });
    const workbook = new exceljs_1.default.Workbook();
    const worksheet = workbook.addWorksheet("Nilai Siswa");
    const filePath = path_1.default.join(__dirname, "..", "..", "..", "public", "files", "exports");
    worksheet.columns = [
        { header: "NIS", key: "nis" },
        { header: "Nama Siswa", key: "username" },
        { header: "Kelas", key: "class" },
        { header: "Jurusan", key: "major" },
        { header: "Ujian", key: "exam_name" },
        { header: "KKM", key: "kkm" },
        { header: "Nilai 1", key: "point1" },
        { header: "Nilai 2", key: "point2" },
    ];
    for (const user of users) {
        let Exams = (await user.getExams());
        let point = JSON.parse(Exams[0].StudentExam.point);
        let data = {
            nis: user.nis,
            username: user.username,
            class: user.class,
            major: user.major,
            exam_name: Exams.length !== 0 ? Exams[0].exam_name : "",
            kkm: Exams.length !== 0 ? Exams[0].kkm_point : "",
            point1: Exams.length !== 0 && point ? point[0].point : "",
            point2: Exams.length !== 0 && point ? point[1].point : "",
        };
        worksheet.addRow(data);
    }
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    try {
        const data = await workbook.xlsx.writeFile(`${filePath}/nilai-siswa.xlsx`)
            .then(() => {
            console.log(data);
            res.send({
                status: "success",
                message: "file successfully downloaded",
                path: `${path_1.default}/nilai-siswa.xlsx`,
            });
        });
    }
    catch (error) {
        res.send(error);
    }
}
exports.ExportCSV = ExportCSV;
async function UpdateLoginStatus(req, res) {
    try {
        let { login_status, id } = req.body;
        let student = await Student_1.default.findByPk(id);
        let admin = await Admin_1.default.findByPk(id);
        if (student) {
            student.update({ login_status });
        }
        else {
            admin.update({ login_status });
        }
        (0, response_1.default)(200, "success update login status", [], res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to update login status", { error: error.message }, res);
    }
}
exports.UpdateLoginStatus = UpdateLoginStatus;
//# sourceMappingURL=utilsController.js.map