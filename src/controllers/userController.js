const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const { Score } = require("../models");
const response = require("./response");

async function addUser(req, res) {
  const body = req.body;
  const newUser = await Score.create({
    nis: body.nis,
    username: body.username,
    class: body.class,
    major: body.major,
    password: body.nis + "!",
  });
  // res.redirect("/siswa");
  response(201, "add new user", newUser, res);
}

async function uploadCSV(req, res) {
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
}

async function createCSV(req, res) {
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
        nilai: user.point ? user.point : 0,
        nilai_remedial: user.remedial_point ? user.remedial_point : 0,
      });
    });
  }
  csvStream.end();
  writableStream.end();
}

async function deleteUser(req, res, next) {
  let checkedSiswa = req.body.checkedSiswa;
  if (!checkedSiswa) {
    const err = new Error("no siswa selected");
    err.status = "fail";
    err.statusCode = 204;
    next(err);
  } else {
    await Score.destroy({
      where: {
        unique_id: checkedSiswa,
      },
    });
    const result = {
      status: "ok",
      message: "siswa berhasil dihapus",
    };
    return res.json(result);
  }
}

module.exports = {
  addUser,
  uploadCSV,
  deleteUser,
  createCSV,
};
