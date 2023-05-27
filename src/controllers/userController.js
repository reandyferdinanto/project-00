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
    path.join(__dirname, "..", "..", "uploads", req.files[0].filename)
  ).pipe(
    csv
      .parse({ headers: true })
      .on("data", (row) => {
        row.password = row.nis + "!##!";
        siswa.push(row);
      })
      .on("end", () => {
        Score.bulkCreate(siswa).then(() => {
          const result = {
            status: "ok",
            filename: req.files[0].filename,
            message: "upload file success",
          };
          return res.json(result);
        });
      })
  );
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
};
