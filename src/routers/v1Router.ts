import express from "express";
import studentRoute from "./v1/studentRoute";
import utilsRouter from "./v1/utilsRoute";
import examRouter from "./v1/examRoute";
import adminRouter from "./v1/adminRoute";
import examTypeRouter from "./v1/examTypeRoute";
import indexRouter from "./indexRoute";

const v1Router = express.Router()

v1Router.use("/", indexRouter);
v1Router.use("/students", studentRoute);
v1Router.use("/utils", utilsRouter);
v1Router.use("/exams", examRouter);
v1Router.use("/admins", adminRouter);
v1Router.use("/topic", examTypeRouter);

export default v1Router