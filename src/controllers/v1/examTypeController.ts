import ExamType from "../../models/ExamType";
import response from "../response";

export async function GetAllExamType(req, res) {
  try {
    await ExamType.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }).then((result) => {
      response(200, "success get all exam type", result, res);
    });
  } catch (error) {
    response(500,"server failed to get all exam type",{ error: error.message },res);
  }
}

export async function GetExamTypeById(req, res) {
  try {
    const pk = req.params.id;
    await ExamType.findByPk(pk,{
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }).then((result) => {
      response(200, "success get some exam topic", result, res);
    });
  } catch (error) {
    response(500,"server failed to get exam type",{ error: error.message },res);
  }
}

export async function UpdateExamType(req, res) {
  try {
    const examTypeData = req.body;
    const examTypeId = req.params.id

    let examType = await ExamType.findByPk(examTypeId)
    examType.update(examTypeData)    
    response(200, "success update exam_type", [], res);
  } catch (error) {
    response(
      500,
      "server failed to update exam type",
      { error: error.message },
      res
    );
  }
}

export async function CreateExamType(req, res) {
  try {
    const topikData = req.body;
    await ExamType.create(topikData).then(() => {
      response(201, "success create new exam_type", [], res);
    });
  } catch (error) {
    response(500, "server failed to create new exam_type", [], res);
  }
}

export async function DeleteExamType(req, res) {
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
