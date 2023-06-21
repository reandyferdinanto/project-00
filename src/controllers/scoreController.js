const { Score, Exam, Question, ScoreExam } = require("../models");
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
      nis: req.body.nis,
      username: req.body.username,
      class: req.body.class,
      major: req.body.major,
      password: req.body.nis + "##",
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
    const { point, remedial_point, exam_id } = req.body;
    const { id } = req.params;

    ScoreExam.findOne({
      where: {
        score_id: id,
        exam_id: exam_id,
      },
    }).then((prev) => {
      ScoreExam.update(
        {
          point: point !== undefined ? point : prev.point,
          remedial_point:
            remedial_point !== undefined ? remedial_point : prev.remedial_point,
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
  const { nis, password } = req.body;
  try {
    const user = await Score.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        nis,
      },
    });
    if (user) {
      if (user.password == password) {
        return res.json({
          ResultCode: 1,
          UserId: user.unique_id,
          Data: user,
        });
      } else {
        return res.json({
          ResultCode: 2,
          Message: "NIS and Password combination didn't match.",
          Status: "failed",
        });
      }
    } else {
      return res.json({
        ResultCode: 2,
        Message: "Authentication failed. Wrong credentials.",
        Status: "failed",
      });
    }
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
