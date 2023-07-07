const { ExamType } = require("../models");
const response = require("./response");

async function getExamType(req, res) {
  try {
    await ExamType.findAll().then((result) => {
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
    await ExamType.findByPk(pk).then((result) => {
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
  // try {
  //     await ExamType.update({},{})
  // } catch (error) {
  // }
}

async function createExamType(req, res) {
  try {
    const { exam_type, tanggal_dibuat } = req.body;
    await ExamType.create({
      exam_type,
      tanggal_dibuat,
    }).then(() => {
      response(201, "success create new exam_type", [], res);
    });
  } catch (error) {
    response(500, "server failed to create new exam_type");
  }
}

module.exports = {
  getExamType,
  getExamTypeById,
  updateExamType,
  createExamType,
};
