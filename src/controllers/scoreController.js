const { Score, Exam, Question, ScoreExam, Admin } = require("../models");
const bcrypt = require('bcrypt')
const response = require("./response");

async function getAllScore(req, res, next) {
  try {
    let score = await Score.findAll({
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
    return response(200, "showing all user", score, res);
  } catch (error) {
    return response(
      500,
      "server failed to get all user",
      { error: error.message },
      res
    );
  }
}

async function getScoreById(req, res, next) {
  try {
    const { id } = req.params;
    const score = await Score.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Exam,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          // include: [
          //   {
          //     model: Question,
          //     attributes: { exclude: ["createdAt", "updatedAt"] },
          //   },
          // ],
          through: {
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      ],
    });
    if (!score) return response(400, "user not found", [], res);
    response(200, "showing user by username", score, res);
  } catch (error) {
    response(500, "server failed to get user", { error: error.message }, res);
  }
}

async function addUser(req, res) {
  try {
    const newUser = await Score.create({
      nis: "001"+req.body.nis,
      username: req.body.username,
      class: req.body.class,
      major: req.body.major,
      password: req.body.nis + "##",
      role: "siswa",
      gender: req.body.gender?req.body.gender:"pria"
    });
    response(201, "add new user", newUser, res);
  } catch (error) {
    response(
      500,
      "server failed to create new user",
      { error: error.message },
      res
    );
  }
}

async function updatePoint(req, res) {
  try {
    const { point, exam_id } = req.body;
    const { id } = req.params;
    let new_point = []

    if (id == undefined || exam_id == undefined) {
      response(
        400,
        "id or exam_id cannot be undefined",
        { error: "id or exam_id undefined" },
        res
      );
    }

    await ScoreExam.findOne({
      where: {
        score_id: id,
        exam_id: exam_id,
      },
    }).then((prev) => {
      if (prev.point){
        new_point = JSON.parse(prev.point)
        new_point.push({
          attemp: new_point.length + 1,
          point
        })
      }else{
        new_point.push({
          attemp: 1,
          point
        })
      }

      ScoreExam.update(
        {
          point: JSON.stringify(new_point),
          number_of_try: prev.number_of_try + 1,
        },
        {
          where: {
            score_id: id,
            exam_id: exam_id,
          },
        }
      ).then(() => {
        response(200, "success updated user point", [], res);
      });
    });
  } catch (error) {
    response(
      500,
      "server failed to update point",
      { error: error.message },
      res
    );
  }
}

async function deleteUser(req, res, next) {
  try {
    let checkedSiswa = req.body.checkedSiswa;
    if (!checkedSiswa) return response(400, "body cant be undefined", [], res);
    await Score.destroy({
      where: {
        unique_id: checkedSiswa,
      },
    }).then((respon) => {
      if (!respon)
        return response(400, "delete failed, user not found", respon, res);
      return response(200, "success delete user", respon, res);
    });
  } catch (error) {
    response(
      500,
      "server failed to delete user",
      { error: error.message },
      res
    );
  }
}

async function userEdit(req, res, next) {
  try {
    let { unique_id, username, nis, major } = req.body;
    // INIT USER
    const user = await Score.findByPk(unique_id);
    let exams_on = Object.keys(req.body).filter((key) => {
      return req.body[key] === "on";
    });
    let exams_off = Object.keys(req.body).filter((key) => {
      return req.body[key] === "off";
    });
    // UPDATE USER
    const updatedUser = await Score.update(
      {
        username: username !== null ? username : user.username,
        nis: nis !== null ? nis : user.nis,
        major: major !== null ? major : user.major,
        class: req.body.class !== null ? req.body.class : user.class,
        gender: req.body.gender?req.body.gender:"pria"
      },
      {
        where: {
          unique_id,
        },
      }
    );
    // EXAMS
    exams_on.forEach(async (exam_id) => {
      let exam = await Exam.findByPk(exam_id);
      if (!(await exam.hasScore(user))) {
        await exam.addScore(user);
      }
    });
    exams_off.forEach(async (exam_id) => {
      let exam = await Exam.findByPk(exam_id);
      if (await exam.hasScore(user)) {
        await exam.removeScore(user);
      }
    });
    response(200, "success update user", updatedUser, res);
  } catch (error) {
    response(
      500,
      "server failed to update user",
      { error: error.message },
      res
    );
  }
}

async function userAuth(req, res) {
  let { nis, password } = req.body;
  try {
    let data
    await Score.findOne({
      where: {
        nis,
      },
    }).then(result => {
      if(result){
        data = {
          unique_id: result.unique_id,
          username: result.username,
          nis: result.nis,
          class: result.class,
          major: result.major,
          role: result.role
        };
        if (result.password == password) {
          return res.json({
            ResultCode: 1,
            UserId: result.unique_id,
            Data: data,
          });
        } else {
          return res.json({
            ResultCode: 2,
            Message: "NIS and Password combination didn't match.",
            Status: "failed",
          });
        }
      }else{
        Admin.findOne({
          where:{
            nuptk: nis
          }
        }).then(hasil => {
          if (hasil){
              data = {
                unique_id: hasil.unique_id,
                username: hasil.username,
                role: hasil.role,
                email: hasil.email,
              };
              bcrypt.compare(password, hasil.password, function(err, match) {
                if(err){
                  return res.json({
                    ResultCode: 2,
                    Message: err,
                    Status: "failed",
                  });
                }
                if (match){
                  return res.json({
                    ResultCode: 1,
                    UserId: hasil.unique_id,
                    Data: data,
                  });
                }else if(!match){
                  return res.json({
                    ResultCode: 2,
                    Message: "NUPTK and Password combination didn't match.",
                    Status: "failed",
                  });
                }
            });
          } else{
            return res.json({
              ResultCode: 2,
              Message: "All user not found.",
              Status: "failed",
            });
          }
        })
      }
    });
  } catch (error) {
    res.json({
      ResultCode: 2,
      Message: { error: error.message },
      Status: "failed",
    });
  }
}

module.exports = {
  getAllScore,
  getScoreById,
  updatePoint,
  deleteUser,
  userEdit,
  addUser,
  userAuth,
};
