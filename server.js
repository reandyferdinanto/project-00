const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});

app.use(multer({ storage: storage, limits: { fileSize: 1000000 } }).any());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTER
const db = require("./src/models");
const scoreRouter = require("./src/routers/scoreRoute");
const indexRouter = require("./src/routers/indexRoute");
const userRouter = require("./src/routers/userRoute");
const examRouter = require("./src/routers/examRoute");

app.get("/ujian", (req, res) => {
  res.render("examsPage");
});
app.get("/ujian/buat", (req, res) => {
  res.render("examsCreate");
});
app.get("/nilai", (req, res) => {
  res.render("nilaiPage");
});
app.get("/siswa", (req, res) => {
  res.render("siswaPage");
});
app.get("/siswa/tambah", (req, res) => {
  res.render("siswaCreate");
});
app.get("/", (req, res) => {
  res.render("berandaPage");
});

app.use("/api/", indexRouter);
app.use("/api/scores", scoreRouter);
app.use("/api/users", userRouter);
app.use("/api/exams", examRouter);

let PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log("server run at port " + PORT));
});
