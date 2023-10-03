const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const { Student, Exam } = require("../../models");
const response = require("./response");
const { convertCsvToXlsx } = require("@aternus/csv-to-xlsx");

async function uploadCSV(req, res) {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "files",
      "uploads",
      req.files[0].filename
    )
    const siswa = [];
    fs.createReadStream(filePath)
    .pipe(
      csv
        .parse({ headers: true })
        .on("data", (row) => {
          let input_header = Object.keys(row);
          let correct_header = ["username", "class", "nis", "major", "gender"];
          const sortedInputHeader = input_header.slice().sort();
          const sortedCorrectHeader = correct_header.slice().sort();
          if (JSON.stringify(sortedInputHeader) !== JSON.stringify(sortedCorrectHeader)) {
            throw Error(
              `Header dari csv harus berupa "username", "class", "nis", "major", "gender"`
            );
          }
          row.nis = req.body.school_id + row.nis
          row.password = row.nis + "##";
          row.school_id = req.body.school_id
          row.school_name = req.body.school_name
          siswa.push(row);
        })
        .on("error", function (e) {
          return response(400, e.message, [], res);
        })
        .on("end", () => {
          Student.bulkCreate(siswa).then((datas) => {
            return response(201, "add new user", datas, res);
          });
          if (fs.existsSync(filePath)) {
            // The file exists, so you can proceed with deleting it
            try {
                fs.unlinkSync(filePath)
            } catch (err) {
                console.error(err)
            }
          } else {
              console.log('File not found')
          }
        })
    );
  } catch (error) {
    res.status().json({
      error: error.message,
    });
  }
}

async function exportCSV(req, res) {
  let users = await Student.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Exam,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      },
    ],
    order: [["username"], [Exam, "createdAt"]],
  });
  if (!fs.existsSync("public/files/exports")) {
    if (!fs.existsSync("public/files")) {
      fs.mkdirSync("public/files");
    }
    if (!fs.existsSync("public/files/exports")) {
      fs.mkdirSync("public/files/exports");
    }
  }

  const csvStream = csv.format({
    headers: true,
  });
  const writableStream = fs.createWriteStream(
    `public/files/exports/nilai-siswa.csv`
  );
  writableStream.on("finish", () => {
    try {
      let source = "public/files/exports/nilai-siswa.csv";
      let destination = "public/files/exports/nilai-siswa.xlsx";
      convertCsvToXlsx(source, destination);
      res.json({
        status_code: 200,
        downloadURL: `public/files/exports/nilai-siswa.xlsx`,
      });
    } catch (error) {
      response(500, "server failed to generate report", error.message, res);
    }
  });
  csvStream.pipe(writableStream);
  if (users.length > 0) {
    users.forEach((user) => {
      if (user.Exams.length !== 0) {
        user.Exams.forEach((exam) => {
          csvStream.write({
            nis: user.nis ? user.nis : 0,
            nama: user.username ? user.username : "",
            kelas: user.class ? user.class : "",
            jurusan: user.major ? user.major : "",
            ujian: exam.exam_name,
            nilai: exam.StudentExam.point,
            nilai_remedial: exam.StudentExam.remedial_point,
          });
        });
      } else {
        csvStream.write({
          nis: user.nis ? user.nis : 0,
          nama: user.username ? user.username : "",
          kelas: user.class ? user.class : "",
          jurusan: user.major ? user.major : "",
          ujian: "Belum mengambil ujian",
        });
      }
    });
  }
  csvStream.end();
  writableStream.end();
}
module.exports = {
  uploadCSV,
  exportCSV,
};
