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
import JSZip from "jszip";

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


  // HIRARKI
  // Kelas + Jurusan (Nama FIle) || Nama Ujian (Worksheet) -> Nilai nilai (Row)
  const filePath = path.join(__dirname,"..","..","..","public","files","exports");

  const zip = new JSZip()

  const Users = await Student.findAll({where: {school_id: req.body.school_id}, include: Exam});
  const Exams = await Exam.findAll({where: {school_id: req.body.school_id}});

  const registeredClass = [...new Set(Users.map(item => item.class))];
  
  for (const [_, kelas] of registeredClass.entries()){


    const usersFilterKelas = Users.filter(user => user.class == kelas)
    
    const workbook = new ExcelJs.Workbook()

    for (const [index,exam] of Exams.entries()) {
      const worksheet = workbook.addWorksheet(exam.exam_name)
      worksheet.columns = [
        {header: "NIS", key: "nis", width:20},
        {header: "Nama Siswa", key: "username", width:20},
        {header: "Kelas", key: "class"},
        {header: "Jurusan", key: "major", width:20},
        {header: "Ujian", key: "exam_name", width:20},
        {header: "KKM", key: "kkm", width:5},
        {header: "Nilai 1", key: "point1", width:7},
        {header: "Nilai 2", key: "point2", width:7},
      ]

      for (const user of usersFilterKelas) {
        let Exams = (await user.getExams({where:{unique_id:exam.unique_id}}))[0];
        let point = Exams ? JSON.parse(Exams.StudentExam.point) : null        
        
        
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
          pattern:'solid',
          fgColor:{argb: "ff8000"}
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

      worksheet.getColumn(6).alignment = {horizontal:"center"}
      worksheet.getColumn(7).alignment = {horizontal:"center"}
      worksheet.getColumn(8).alignment = {horizontal:"center"}
    
    }


    try {
      await workbook.xlsx.writeFile(`${filePath}/${req.body.school_name}-${kelas}.xlsx`)
      const excelData = fs.readFileSync(`${filePath}/${req.body.school_name}-${kelas}.xlsx`);
      zip.file(`${req.body.school_name}-${kelas}.xlsx`, excelData)
      fs.unlinkSync(`${filePath}/${req.body.school_name}-${kelas}.xlsx`);
    } catch (error) {
      return res.send(error)
    }

  }
  
  try {
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(`${filePath}/${req.body.school_name}.zip`))
      .on('finish', function () {
          res.json({
            downloadLink: `files/exports/${req.body.school_name}.zip`
          })
      });
  } catch (error) {
    
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
