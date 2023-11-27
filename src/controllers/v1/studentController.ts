import { Response, Request } from "express";
import bcrypt from "bcrypt";
import response from "../response";
import Exam from "../../models/Exam";
import Student from "../../models/Student";
import StudentExam from "../../models/StudentExam";
import Admin from "../../models/Admin";
import Metric from "../../models/Metric";
import MetricSchool from "../../models/MetricSchool";

export const GetAllStudent = async (req:Request, res:Response, next) => {
  try {
    let students = await Student.findAll({attributes: { exclude: ["createdAt", "updatedAt", "password"] },include: [
        {model: Exam, attributes: { exclude: ["createdAt", "updatedAt"] },
        through: {
          attributes: {exclude: ["createdAt", "updatedAt"]}}
        },
      ],
      order: ["nis"]
    });
    return response(200, "showing all students", students, res);
  } catch (error) {
    return response(500,"server failed to get all user",{ error: error.message },res);
  }
}

export const GetStudentById = async (req: Request, res:Response) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByPk(studentId, {attributes: { exclude: ["createdAt", "updatedAt", "password"] },include: [
      {model: Exam,attributes: { exclude: ["createdAt", "updatedAt"] },},
    ]});

    if (student){
      response(200, "showing student data by ID", student, res);
    } else{
      return response(400, "user not found", [], res);
    }
  } catch (error) {
    response(500, "server failed to get user", { error: error.message }, res);
  }
}

export const AddStudent = async (req: Request, res:Response) => {
  try {
    let studentData = req.body
    studentData.nis = studentData.school_id + studentData.nis;
    studentData.password = studentData.nis + "##";
    studentData.role = "siswa"
    const newStudents = await Student.create(studentData);

    const METRIC = await Metric.findOne()
    const METRICSCHOOL = await MetricSchool.findOne({where:{school_id:studentData.school_id}})
    METRIC.update({total_student: METRIC.total_student+1})
    METRIC.hasMetric_school(METRICSCHOOL).then(async isHas => {
      if(!isHas){
        let NEW_METRICSCHOOL = await MetricSchool.create({
          student_counter: 1,
          school_id: studentData.school_id,
          school_name: studentData.school_name
        })
        METRIC.addMetric_school(NEW_METRICSCHOOL)
      }else{
        METRICSCHOOL.update({
          student_counter: METRICSCHOOL.student_counter+1
        })
      }
    })
    


    response(201, "add new Students", newStudents, res);
  } catch (error) {
    response(500,"server failed to create new Students",{ error: error.message },res);
  }
}

export const UpdateStudentPoint = async (req:Request, res:Response) => {
  try {
    const { point, exam_id } = req.body;
    const { id } = req.params;
    let new_point = [];

    if (id == undefined || exam_id == undefined) return response(400,"id or exam_id cannot be undefined",{ error: "id or exam_id undefined" },res);

    await StudentExam.findOne({where: {score_id: id,exam_id: exam_id},})
      .then((prev) => {
        if (prev.point) {
          new_point = JSON.parse(prev.point);
          new_point.push({attemp: new_point.length + 1,point});
        } else {
          new_point.push({attemp: 1,point});
        }

        StudentExam.update(
          {point: JSON.stringify(new_point),number_of_try: prev.number_of_try + 1},
          {where: {score_id: id,exam_id: exam_id},
        })
      .then(() => {
        return response(200, "success updated user point", [], res);
      });
    });
  } catch (error) {
    response(500,"server failed to update point",{ error: error.message },res);
  }
}

export const DeleteUser = async (req:Request, res:Response) => {
  try {
    let checkedSiswa = req.body.checkedSiswa;
    if (!checkedSiswa) return response(400, "body cant be undefined", [], res);
    
    await Student.destroy({
      where: {
        unique_id: checkedSiswa,
      },
    }).then((respon) => {
      if (!respon) return response(400, "delete failed, user not found", respon, res);
      return response(200, "success delete user", respon, res);
    });
  } catch (error) {
    response(500,"server failed to delete user",{ error: error.message },res);
  }
}

export const EditStudent = async (req:Request, res:Response) => {
  try {
    let studentId = req.params.id
    let studentData = req.body;
    // User update
    const user = await Student.findByPk(studentId);
    if(!user) return response(400, "user not found", [], res);
    if(studentData.nis !== undefined) studentData.nis = user.school_id + studentData.nis
    user.update(studentData)

    let exams_on = Object.keys(studentData).filter((key) => {
      return studentData[key] === "on";
    });
    let exams_off = Object.keys(studentData).filter((key) => {
      return studentData[key] === "off";
    });

    exams_on.forEach(async (exam_id) => {
      let exam = await Exam.findByPk(exam_id);
      if (!(await exam.hasStudent(user))) {
        await exam.addStudent(user);
      }
    });
    exams_off.forEach(async (exam_id) => {
      let exam = await Exam.findByPk(exam_id);
      if (await exam.hasStudent(user)) {
        await exam.removeStudent(user);
      }
    });
    response(200, "success update user", user, res);
  } catch (error) {
    response(
      500,
      "server failed to update user",
      { error: error.message },
      res
    );
  }
}

export const AuthStudent = async (req, res) => {
  let { nis, password } = req.body;
  try {
    let data;

    let studentLogin = await Student.findOne({where:{nis},raw:true,attributes:{exclude:["createdAt","updatedAt"]}})
    let adminLogin = await Admin.findOne({where:{nuptk:nis},raw:true,attributes:{exclude:["createdAt","updatedAt"]}})

    if(!studentLogin && !adminLogin){
      res.json({
        ResultCode: 2,
        Message: "User not found.",
        Status: "failed",
      });
    }
    
    if(studentLogin){
      if(password == studentLogin.password){
        data = studentLogin
        res.json({
          ResultCode: 1,
          UserId: studentLogin.unique_id,
          Data: data,
        });
      }else{
        res.json({
          ResultCode: 2,
          Message: "NIS and Password combination didn't match.",
          Status: "failed",
        });
      }
    }
    if(adminLogin){
      let passwordCorrect = await bcrypt.compare(password, adminLogin.password)
      if(passwordCorrect){
        data = adminLogin
        res.json({
          ResultCode: 1,
          UserId: adminLogin.unique_id,
          Data: adminLogin,
        });
      }else{
        res.json({
          ResultCode: 2,
          Message: "NIS and Password combination didn't match.",
          Status: "failed",
        });
      }
    }
    
    
    if(data !== undefined){
      const METRIC = await Metric.findOne()
      const METRICSCHOOL = await MetricSchool.findOne({where:{school_id:data.school_id}})
      METRIC.update({total_login: METRIC.total_login+1})
      METRIC.hasMetric_school(METRICSCHOOL).then(async isHas => {
        if(!isHas){
          let NEW_METRICSCHOOL = await MetricSchool.create({
            login_counter: 1,
            school_id: data.school_id,
            school_name: data.school_name
          })
          METRIC.addMetric_school(NEW_METRICSCHOOL)
        }else{
          METRICSCHOOL.update({
            login_counter: METRICSCHOOL.login_counter+1
          })
        }
      })
    }

  } catch (error) {
    res.json({
      ResultCode: 2,
      Message: { error: error.message },
      Status: "failed",
    });
  }
}
