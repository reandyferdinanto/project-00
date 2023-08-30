const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const { Score, Exam } = require("../models");
const response = require("./response");
const { convertCsvToXlsx } = require("@aternus/csv-to-xlsx");

async function uploadCSV(req, res) {
  try {
    const filePath = path.join(
      __dirname,
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
          let correct_header = ["username", "class", "nis", "major"];
          const sortedInputHeader = input_header.slice().sort();
          const sortedCorrectHeader = correct_header.slice().sort();
          if (JSON.stringify(sortedInputHeader) !== JSON.stringify(sortedCorrectHeader)) {
            throw Error(
              `Header dari csv harus berupa "username", "class", "nis", "major"`
            );
          }
          row.password = row.nis + "!##!";
          siswa.push(row);
        })
        .on("error", function (e) {
          return response(400, e.message, [], res);
        })
        .on("end", () => {
          Score.bulkCreate(siswa).then((datas) => {
            return response(201, "add new user", datas, res);
          });
          if (fs.existsSync(filePath)) {
            // The file exists, so you can proceed with deleting it
            try {
                fs.unlinkSync(filePath)
                console.log('File deleted successfully')
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
  let users = await Score.findAll({
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
            nilai: exam.ScoreExam.point,
            nilai_remedial: exam.ScoreExam.remedial_point,
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

// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false;
  // if the argument is the same array, we can be sure the contents are same as well
  if (array === this) return true;
  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

module.exports = {
  uploadCSV,
  exportCSV,
};
