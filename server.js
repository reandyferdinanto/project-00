const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.use("/api/", indexRouter);
app.use("/api/scores", scoreRouter);
app.use("/api/users", userRouter);
app.use("/api/exams", examRouter);

let PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log("server run at port " + PORT));
});
