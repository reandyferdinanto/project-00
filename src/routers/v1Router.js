const v1Router = require('express').Router()
const studentRoute = require("./v1/studentRoute");
const utilsRouter = require("./v1/utilsRoute");
const examRouter = require("./v1/examRoute");
const adminRouter = require("./v1/adminRoute");
const examTypeRouter = require("./v1/examTypeRoute");
const indexRouter = require("./indexRoute");

v1Router.use("/", indexRouter);
v1Router.use("/students", studentRoute);
v1Router.use("/utils", utilsRouter);
v1Router.use("/exams", examRouter);
v1Router.use("/admins", adminRouter);
v1Router.use("/exam_type", examTypeRouter);

module.exports = v1Router