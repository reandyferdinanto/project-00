import csv from "csv-parser";
import fs from "fs";
import path from "path";
import response from "../response";
import Student from "../../models/Student";
import Exam from "../../models/Exam";
import Admin from "../../models/Admin";
import Metric from "../../models/Metric";
import MetricSchool from "../../models/MetricSchool";
import {Request, Response} from "express"
import ExcelJs from "exceljs"

let RowCount = 0

export async function UploadCSV(req:Request, res:Response) {
  const CORRECT_HEADER = ["username", "class", "nis", "major", "gender"];
  
  try {
    const filePath = path.join(__dirname,"..","..","..","public","files","uploads",req.files[0].filename);

    fs.createReadStream(filePath).pipe(csv())
        .on("data", async (row) => {
          let input_header = Object.keys(row);
          const sortedInputHeader = input_header.slice().sort();
          const sortedCorrectHeader = CORRECT_HEADER.slice().sort();
          if (JSON.stringify(sortedInputHeader) !== JSON.stringify(sortedCorrectHeader)) {
            throw Error(
              `Header dari csv harus berupa "username", "class", "nis", "major", "gender"`
            );
          }

          row.nis = req.body.school_id + row.nis;
          row.password = row.nis + "##";
          row.role = "siswa"
          row.school_id = req.body.school_id;
          row.school_name = req.body.school_name;
          RowCount += 1
          
          await Student.create(row)
        })
        .on("error", e => response(400, e.message, [], res))
        .on("end", async () => {
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(err);
            }
          } else {
            console.log("File not found");
          }

          const METRIC = await Metric.findOne();
          const METRICSCHOOL = await MetricSchool.findOne({ where: { school_id: req.body.school_id } });
          await METRIC.update({ total_student: METRIC.total_student + RowCount });
          const isHas = await METRIC.hasMetric_school(METRICSCHOOL);
          if (!isHas) {
            let NEW_METRICSCHOOL = await MetricSchool.create({
              student_counter: RowCount,
              school_id: req.body.school_id,
              school_name: req.body.school_name
            });
            await METRIC.addMetric_school(NEW_METRICSCHOOL);
          } else {
            await METRICSCHOOL.update({
              student_counter: METRICSCHOOL.student_counter + RowCount
            });
          }

          return response(201, "add new user", [], res);
        })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function ExportCSV(req:Request, res:Response) {
  const userData = []
  const users = await Student.findAll({where: {school_id: req.body.school_id}, include: Exam});
  

  const workbook = new ExcelJs.Workbook()
  const worksheet = workbook.addWorksheet("Nilai Siswa")
  const filePath = path.join(__dirname,"..","..","..","public","files","exports");

  worksheet.columns = [
    {header: "NIS", key: "nis"},
    {header: "Nama Siswa", key: "username"},
    {header: "Kelas", key: "class"},
    {header: "Jurusan", key: "major"},
    {header: "Ujian", key: "exam_name"},
    {header: "KKM", key: "kkm"},
    {header: "Nilai 1", key: "point1"},
    {header: "Nilai 2", key: "point2"},
  ]

  for (const user of users) {
    let Exams = (await user.getExams());
    let point = JSON.parse(Exams[0].StudentExam.point)

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
       path: `${path}/nilai-siswa.xlsx`,
      });
   });
  } catch (error) {
    res.send(error)
  }

}

export async function UpdateLoginStatus(req:Request, res:Response) {
  try {
    let { login_status, id } = req.body;
    let student = await Student.findByPk(id);
    let admin = await Admin.findByPk(id);

    if (student) {
      student.update({login_status});
    } else {
      admin.update({login_status});
    }
    response(200, "success update login status", [], res);
  } catch (error) {
    response(500,"server failed to update login status",{ error: error.message },res);
  }
}
