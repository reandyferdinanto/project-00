const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const { Score } = require("../models");
const response = require("./response");

async function uploadCSV(req, res) {
  try {
    const siswa = [];
    fs.createReadStream(
      path.join(
        __dirname,
        "..",
        "..",
        "public",
        "files",
        "uploads",
        req.files[0].filename
      )
    ).pipe(
      csv
        .parse({ headers: true })
        .on("data", (row) => {
          row.password = row.nis + "!##!";
          siswa.push(row);
        })
        .on("end", () => {
          Score.bulkCreate(siswa).then((datas) => {
            return response(201, "add new user", datas, res);
          });
        })
    );
  } catch (error) {
    res.status().json({
      error: error.message,
    });
  }
}

async function exportCSV(req, res) {
  let users = await Score.findAll();
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
    res.json({
      status_code: 200,
      downloadURL: `public/files/exports/nilai-siswa.csv`,
    });
  });
  csvStream.pipe(writableStream);
  if (users.length > 0) {
    users.map((user) => {
      csvStream.write({
        nis: user.nis ? user.nis : 0,
        nama: user.username ? user.username : 0,
        kelas: user.class ? user.class : 0,
        jurusan: user.major ? user.major : 0,
        // nilai: user.Exams[0].ScoreExam.point,
        // nilai_remedial: user.Exams[0].ScoreExam.remedial_point,
      });
    });
  }
  csvStream.end();
  writableStream.end();
}

module.exports = {
  uploadCSV,
  exportCSV,
};
