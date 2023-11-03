const { ExamType } = require("../../models");
const response = require("./response");

async function getExamType(req, res) {
  try {
    await ExamType.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }).then((result) => {
      response(200, "success get all exam type", result, res);
    });
  } catch (error) {
    response(
      500,
      "server failed to get all exam type",
      { error: error.message },
      res
    );
  }
}

async function getExamTypeById(req, res) {
  try {
    const pk = req.params.id;
    await ExamType.findByPk(pk,{
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }).then((result) => {
      response(200, "success get exam type", result, res);
    });
  } catch (error) {
    response(
      500,
      "server failed to get exam type",
      { error: error.message },
      res
    );
  }
}

async function updateExamType(req, res) {
  try {
    const { exam_type, unique_id } = req.body;
    await ExamType.findByPk(unique_id).then((prev) => {
      ExamType.update(
        {
          exam_type: exam_type,
        },
        {
          where: {
            unique_id,
          },
        }
      );
      response(200, "success update exam_type", [], res);
    });
  } catch (error) {
    response(
      500,
      "server failed to update exam type",
      { error: error.message },
      res
    );
  }
}

async function createExamType(req, res) {
  try {
    const topikData = req.body;
    await ExamType.create(topikData).then(() => {
      response(201, "success create new exam_type", [], res);
    });
  } catch (error) {
    response(500, "server failed to create new exam_type");
  }
}

async function deleteExamType(req, res) {
  console.log(req.body);
  try {
    let unique_id = req.body.unique_id;
    if (!unique_id)
      return response(400, "body cant be undefined", [], res);
    await ExamType.destroy({
      where: {
        unique_id,
      },
    }).then((respon) => {
      if (!respon)
        return response(400, "delete failed, exam_type not found", respon, res);
      return response(200, "success delete exam_type", respon, res);
    });
  } catch (error) {
    response(
      500,
      "server failed to delete admin",
      { error: error.message },
      res
    );
  }
}

module.exports = {
  getExamType,
  getExamTypeById,
  updateExamType,
  createExamType,
  deleteExamType,
};
