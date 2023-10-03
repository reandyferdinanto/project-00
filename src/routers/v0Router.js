const v0Router = require('express').Router()
const scoreRouter = require("./v0/scoreRoute");
const utilsRouter = require("./v0/utilsRoute");
const examRouter = require("./v0/examRoute");
const adminRouter = require("./v0/adminRoute");
const examTypeRouter = require("./v0/examTypeRoute");
const indexRouter = require("./indexRoute");

v0Router.use("/", indexRouter);
v0Router.use("/scores", scoreRouter);
v0Router.use("/utils", utilsRouter);
v0Router.use("/exams", examRouter);
v0Router.use("/admin", adminRouter);
v0Router.use("/exam_type", examTypeRouter);

module.exports = v0Router