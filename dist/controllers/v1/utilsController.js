"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLoginStatus = exports.UploadCSV = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const response_1 = __importDefault(require("../response"));
const Student_1 = __importDefault(require("../../models/Student"));
const Admin_1 = __importDefault(require("../../models/Admin"));
const Metric_1 = __importDefault(require("../../models/Metric"));
const MetricSchool_1 = __importDefault(require("../../models/MetricSchool"));
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
// export async function ExportCSV(req, res) {
//   let users = await Student.findAll({
//     attributes: { exclude: ["createdAt", "updatedAt"] },
//     include: [
//       {
//         model: Exam,
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         through: {
//           attributes: { exclude: ["createdAt", "updatedAt"] },
//         },
//       },
//     ],
//     order: [[Student,"username"], [Exam, "createdAt"]],
//   });
//   if (!fs.existsSync("public/files/exports")) {
//     if (!fs.existsSync("public/files")) {
//       fs.mkdirSync("public/files");
//     }
//     if (!fs.existsSync("public/files/exports")) {
//       fs.mkdirSync("public/files/exports");
//     }
//   }
//   const csvStream = csv.format({
//     headers: true,
//   });
//   const writableStream = fs.createWriteStream(
//     `public/files/exports/nilai-siswa.csv`
//   );
//   writableStream.on("finish", () => {
//     try {
//       let source = "public/files/exports/nilai-siswa.csv";
//       let destination = "public/files/exports/nilai-siswa.xlsx";
//       convertCsvToXlsx(source, destination);
//       res.json({
//         status_code: 200,
//         downloadURL: `public/files/exports/nilai-siswa.xlsx`,
//       });
//     } catch (error) {
//       response(500, "server failed to generate report", error.message, res);
//     }
//   });
//   csvStream.pipe(writableStream);
//   if (users.length > 0) {
//     users.forEach((user) => {
//       if (user.Exams.length !== 0) {
//         user.Exams.forEach((exam) => {
//           csvStream.write({
//             nis: user.nis ? user.nis : 0,
//             nama: user.username ? user.username : "",
//             kelas: user.class ? user.class : "",
//             jurusan: user.major ? user.major : "",
//             ujian: exam.exam_name,
//             nilai: exam.StudentExam.point,
//             nilai_remedial: exam.StudentExam.remedial_point,
//           });
//         });
//       } else {
//         csvStream.write({
//           nis: user.nis ? user.nis : 0,
//           nama: user.username ? user.username : "",
//           kelas: user.class ? user.class : "",
//           jurusan: user.major ? user.major : "",
//           ujian: "Belum mengambil ujian",
//         });
//       }
//     });
//   }
//   csvStream.end();
//   writableStream.end();
// }
async function UpdateLoginStatus(req, res) {
    try {
        let { login_status, id } = req.body;
        let student = await Student_1.default.findByPk(id);
        let admin = await Admin_1.default.findByPk(id);
        if (student) {
            student.update({
                login_status,
            });
        }
        else {
            admin.update({
                login_status,
            });
        }
        (0, response_1.default)(200, "success update login status", [], res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to update login status", { error: error.message }, res);
    }
}
exports.UpdateLoginStatus = UpdateLoginStatus;
//# sourceMappingURL=utilsController.js.map