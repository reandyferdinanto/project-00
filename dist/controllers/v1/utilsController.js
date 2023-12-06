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
const jszip_1 = __importDefault(require("jszip"));
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
    // HIRARKI
    // Kelas + Jurusan (Nama FIle) || Nama Ujian (Worksheet) -> Nilai nilai (Row)
    const filePath = path_1.default.join(__dirname, "..", "..", "..", "public", "files", "exports");
    const zip = new jszip_1.default();
    const Users = await Student_1.default.findAll({ where: { school_id: req.body.school_id }, include: Exam_1.default });
    const Exams = await Exam_1.default.findAll({ where: { school_id: req.body.school_id } });
    const registeredClass = [...new Set(Users.map(item => item.class))];
    for (const [_, kelas] of registeredClass.entries()) {
        const usersFilterKelas = Users.filter(user => user.class == kelas);
        const workbook = new exceljs_1.default.Workbook();
        for (const [index, exam] of Exams.entries()) {
            const worksheet = workbook.addWorksheet(exam.exam_name);
            worksheet.columns = [
                { header: "NIS", key: "nis", width: 20 },
                { header: "Nama Siswa", key: "username", width: 20 },
                { header: "Kelas", key: "class" },
                { header: "Jurusan", key: "major", width: 20 },
                { header: "Ujian", key: "exam_name", width: 20 },
                { header: "KKM", key: "kkm", width: 5 },
                { header: "Nilai 1", key: "point1", width: 7 },
                { header: "Nilai 2", key: "point2", width: 7 },
            ];
            for (const user of usersFilterKelas) {
                let Exams = (await user.getExams({ where: { unique_id: exam.unique_id } }))[0];
                let point = Exams ? JSON.parse(Exams.StudentExam.point) : null;
                let data = {
                    nis: user.nis.slice(4),
                    username: user.username,
                    class: user.class,
                    major: user.major,
                    exam_name: Exams ? Exams.exam_name : "Belum mengambil ujian",
                    kkm: Exams ? Exams.kkm_point : "-",
                    point1: Exams && point && point[0] ? +point[0].point : "-",
                    point2: Exams && point && point[1] ? +point[1].point : "-",
                };
                worksheet.addRow(data);
            }
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "ff8000" }
                };
            });
            // Mendapatkan jumlah baris dan kolom dalam worksheet
            const rowCount = worksheet.rowCount;
            const columnCount = worksheet.columnCount;
            // Loop untuk menambahkan border ke setiap sel
            function getExcelColumnLetter(colNumber) {
                let dividend = colNumber + 1;
                let columnName = '';
                while (dividend > 0) {
                    const modulo = (dividend - 1) % 26;
                    columnName = String.fromCharCode(65 + modulo) + columnName;
                    dividend = Math.floor((dividend - modulo) / 26);
                }
                return columnName;
            }
            // Loop untuk menambahkan border ke setiap sel
            for (let i = 0; i <= rowCount; i++) {
                for (let j = 0; j < columnCount; j++) {
                    const cellRef = getExcelColumnLetter(j) + i;
                    const cell = worksheet.getCell(cellRef);
                    cell.border = {
                        top: { style: 'medium' },
                        left: { style: 'medium' },
                        bottom: { style: 'medium' },
                        right: { style: 'medium' },
                    };
                }
            }
            worksheet.getColumn(6).alignment = { horizontal: "center" };
            worksheet.getColumn(7).alignment = { horizontal: "center" };
            worksheet.getColumn(8).alignment = { horizontal: "center" };
        }
        try {
            await workbook.xlsx.writeFile(`${filePath}/${req.body.school_name}-${kelas}.xlsx`);
            const excelData = fs_1.default.readFileSync(`${filePath}/${req.body.school_name}-${kelas}.xlsx`);
            zip.file(`${req.body.school_name}-${kelas}.xlsx`, excelData);
            fs_1.default.unlinkSync(`${filePath}/${req.body.school_name}-${kelas}.xlsx`);
        }
        catch (error) {
            return res.send(error);
        }
    }
    try {
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs_1.default.createWriteStream(`${filePath}/${req.body.school_name}.zip`))
            .on('finish', function () {
            res.json({
                downloadLink: `files/exports/${req.body.school_name}.zip`
            });
        });
    }
    catch (error) {
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