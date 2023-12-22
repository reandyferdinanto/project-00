"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExamById = exports.DeleteExam = exports.GetAllExam = exports.UpdateExam = exports.AddExam = void 0;
const Exam_1 = __importDefault(require("../../models/Exam"));
const Student_1 = __importDefault(require("../../models/Student"));
const Question_1 = __importDefault(require("../../models/Question"));
const TempData_1 = __importDefault(require("../../utils/TempData"));
const response_1 = __importDefault(require("../response"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PilganAnswer_1 = __importDefault(require("../../models/PilganAnswer"));
const CardAnswer_1 = __importDefault(require("../../models/CardAnswer"));
const CardAnswerAnswer_1 = __importDefault(require("../../models/CardAnswerAnswer"));
const Metric_1 = __importDefault(require("../../models/Metric"));
const MetricSchool_1 = __importDefault(require("../../models/MetricSchool"));
async function AddExam(req, res) {
    try {
        let { exam_type, exam_name, kkm_point, available_try, question_text, correct_answer, question_type, card_answers, answer_with_image, school_id, school_name } = req.body;
        const USER_ID = req.user.id;
        for (let i = 0; i < TempData_1.default.length; i++) {
            if (TempData_1.default[i].id === USER_ID) {
                TempData_1.default.splice(i, 1);
                i--;
            }
        }
        let card_answer_index = 0;
        card_answers = JSON.parse(card_answers);
        answer_with_image = JSON.parse(answer_with_image);
        const student = await Student_1.default.findAll();
        const exam = await Exam_1.default.create({
            exam_type,
            exam_name,
            kkm_point,
            available_try,
            school_id,
            school_name
        });
        // Metric Counter for analysis
        const METRIC = await Metric_1.default.findOne();
        const METRICSCHOOL = await MetricSchool_1.default.findOne({ where: { school_id } });
        METRIC.update({ total_exam: METRIC.total_exam + 1 });
        METRIC.hasMetric_school(METRICSCHOOL).then(async (isHas) => {
            if (!isHas) {
                let NEW_METRICSCHOOL = await MetricSchool_1.default.create({
                    exam_counter: 1,
                    school_id: school_id,
                    school_name: school_name
                });
                METRIC.addMetric_school(NEW_METRICSCHOOL);
            }
            else {
                METRICSCHOOL.update({
                    exam_counter: METRICSCHOOL.exam_counter + 1
                });
            }
        });
        if (Array.isArray(question_text)) {
            let question_with_img = req.body.index_deleted.split(",");
            let count = 0;
            let answer_count = 0;
            // LOOP THROUGH QUESTION
            question_text.forEach(async (qt, index) => {
                if (question_type[index] == "pilihan_ganda") {
                    // HANDLE IMAGE
                    const filteredData = req.files.filter((item, idx) => {
                        return item.fieldname.startsWith("answer_image_");
                    });
                    const question_image = req.files.filter((item) => item.fieldname === `question_img`);
                    let img = "";
                    if (question_with_img.includes(index.toString())) {
                        img = `${req.protocol + "://" + req.get("host")}/files/uploads/${question_image[count].filename}`;
                        count += 1;
                    }
                    else {
                        img = null;
                    }
                    let answers = [Array.isArray(correct_answer) ? correct_answer[answer_count] : correct_answer, ...req.body.wrong_answer.slice(answer_count * 4, (answer_count + 1) * 4)];
                    let pilgan_answers = answers.map((ans, index_ans) => {
                        let answer_img = filteredData.filter(item => {
                            return item.fieldname == `answer_image_${index}${index_ans}`;
                        });
                        return {
                            index: index_ans,
                            answer: ans,
                            image: answer_img.length !== 0 ? `${req.protocol + "://" + req.get("host")}/files/uploads/${answer_img[0].filename}` : null
                        };
                    });
                    answer_count += 1;
                    let Pilgananswer = await PilganAnswer_1.default.bulkCreate(pilgan_answers);
                    const question = await Question_1.default.create({
                        question_text: question_text[index],
                        question_img: img,
                        question_type: question_type[index],
                    });
                    question.addPilgan_answers(Pilgananswer);
                    exam.addQuestion(question);
                }
                else if (question_type[index] == "kartu") {
                    let img = "";
                    if (question_with_img.includes(index.toString())) {
                        img = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[count].filename}`;
                        count += 1;
                    }
                    else {
                        img = null;
                    }
                    let card_answers_questionId = card_answers[card_answer_index].questionId;
                    let card_answers_answers = card_answers[card_answer_index].answers;
                    card_answer_index += 1;
                    let Cardanswer = await CardAnswer_1.default.create({ questionId: card_answers_questionId });
                    let Cardansweranswer = await CardAnswerAnswer_1.default.bulkCreate(card_answers_answers);
                    const question = await Question_1.default.create({
                        question_text: question_text[index],
                        question_img: img,
                        question_type: question_type[index],
                    });
                    exam.addQuestion(question);
                    question.setCard_answers(Cardanswer);
                    Cardanswer.addAnswers(Cardansweranswer);
                }
            });
            exam.addStudents(student);
        }
        else {
            if (question_type == "pilihan_ganda") {
                // // -----------ANSWER IMAGE HANDLE-----------
                let filteredData = req.files.filter((item, idx) => {
                    return item.fieldname.startsWith("answer_image_");
                });
                const question_image = req.files.filter((item) => item.fieldname === `question_img`);
                let answers = [correct_answer, ...req.body.wrong_answer];
                let pilgan_answers = answers.map((ans, index) => {
                    let answer_img = filteredData.filter(item => {
                        return item.fieldname == `answer_image_0${index}`;
                    });
                    return {
                        index,
                        answer: ans,
                        image: answer_img.length !== 0 ? `${req.protocol + "://" + req.get("host")}/files/uploads/${answer_img[0].filename}` : null
                    };
                });
                // ----------END HANDLE---------------
                const Pilgananswer = await PilganAnswer_1.default.bulkCreate(pilgan_answers);
                const question = await Question_1.default.create({
                    question_text,
                    question_img: question_image.length !== 0
                        ? `${req.protocol + "://" + req.get("host")}/files/uploads/${question_image[0].filename}`
                        : null,
                    question_type,
                });
                exam.addQuestion(question);
                exam.addStudents(student);
                question.addPilgan_answers(Pilgananswer);
            }
            else if (question_type == "kartu") {
                let card_answers_questionId = card_answers[0].questionId;
                let card_answers_answers = card_answers[0].answers;
                let Cardanswer = await CardAnswer_1.default.create({ questionId: card_answers_questionId });
                let Cardansweranswer = await CardAnswerAnswer_1.default.bulkCreate(card_answers_answers);
                const question = await Question_1.default.create({
                    question_text,
                    question_img: req.files[0] !== undefined
                        ? `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
                        : null,
                    question_type,
                });
                exam.addQuestion(question);
                exam.addStudents(student);
                question.setCard_answers(Cardanswer);
                Cardanswer.addAnswers(Cardansweranswer);
            }
        }
        return (0, response_1.default)(200, "success create new exam", [], res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to add new exam", { error: error.message }, res);
    }
}
exports.AddExam = AddExam;
async function UpdateExam(req, res) {
    try {
        const examId = req.params.id;
        let { exam_type, exam_name, kkm_point, available_try, question_text, correct_answer, question_type, card_answers, allImage } = req.body;
        let card_answer_index = 0;
        card_answers = JSON.parse(card_answers);
        let question_id = req.body.question_unique_id.split(",");
        allImage = allImage.split(',');
        // DELETE FILE NOT USED
        const filePath = path_1.default.join(__dirname, '..', '..', '..', 'public', 'files', 'uploads');
        if (Array.isArray(allImage) && allImage.length > 0) {
            allImage.forEach((filename) => {
                const fileToDelete = path_1.default.join(filePath, filename);
                if (fs_1.default.existsSync(fileToDelete)) {
                    try {
                        fs_1.default.unlinkSync(fileToDelete);
                        console.log(`File ${filename} deleted successfully.`);
                    }
                    catch (err) {
                        console.error(`Error deleting file ${filename}: ${err}`);
                    }
                }
                else {
                    console.log(`File ${filename} not found.`);
                }
            });
        }
        else {
            console.log('No files to delete.');
        }
        // cari exam untuk prev data
        const exam = await Exam_1.default.findByPk(examId);
        if (!exam)
            return (0, response_1.default)(400, "exam not found", [], res);
        exam.update({
            exam_name: exam_name,
            exam_type: exam_type,
            kkm_point: kkm_point,
            available_try: available_try,
        });
        // daftarkan siswa ke ujian atau hapus siswa dari ujain
        let siswa_on = Object.keys(req.body).filter((key) => {
            return req.body[key] === "on";
        });
        let siswa_off = Object.keys(req.body).filter((key) => {
            return req.body[key] === "off";
        });
        siswa_on.forEach(async (siswa_id) => {
            let user = await Student_1.default.findByPk(siswa_id);
            if (!(await exam.hasStudent(user))) {
                await exam.addStudent(user);
            }
        });
        siswa_off.forEach(async (siswa_id) => {
            let user = await Student_1.default.findByPk(siswa_id);
            if (await exam.hasStudent(user)) {
                await exam.removeStudent(user);
            }
        });
        // update ujian menjadi yang terbaru
        // IF QUESTION > 1
        if (Array.isArray(question_text)) {
            question_type = question_type.split(',');
            let question_with_img = req.body.index_deleted.split(",");
            let imgCounter = 0;
            let answerCounter = 0;
            let a = req.body.all_question_id.split(',');
            let b = req.body.question_unique_id.split(',');
            const valuesNotInB = a.filter(value => !b.includes(value));
            await Question_1.default.destroy({ where: { unique_id: valuesNotInB } });
            for (const [index, questId] of question_id.entries()) {
                const question_image = req.files.filter((item) => item.fieldname === `question_img`);
                let img = "";
                if (question_with_img.includes(index.toString())) {
                    img = `${req.protocol + "://" + req.get("host")}/files/uploads/${question_image[imgCounter].filename}`;
                    imgCounter += 1;
                }
                else {
                    img = null;
                }
                if (question_type[index] === "pilihan_ganda") {
                    // HANDLE IMAGE
                    const filteredData = req.files.filter(item => item.fieldname.startsWith("answer_image_"));
                    let answers = [Array.isArray(correct_answer) ? correct_answer[answerCounter] : correct_answer, ...req.body.wrong_answer.slice(answerCounter * 4, (answerCounter + 1) * 4)];
                    let updatePilgan = answers.map((ans, index_ans) => {
                        let answer_img = filteredData.filter(item => item.fieldname == `answer_image_${index}${index_ans}`);
                        return {
                            index: index_ans,
                            answer: ans,
                            image: answer_img.length !== 0 ? `${req.protocol + "://" + req.get("host")}/files/uploads/${answer_img[0].filename}` : null
                        };
                    });
                    let PILGANANSWER = await PilganAnswer_1.default.bulkCreate(updatePilgan);
                    answerCounter += 1;
                    let updateQuestion = {
                        question_text: question_text[index],
                        question_img: img,
                        question_type: question_type[index],
                    };
                    const QUESTION = await Question_1.default.findByPk(questId);
                    QUESTION.update(updateQuestion);
                    await QUESTION.getPilgan_answers().then(pilgan => {
                        pilgan.forEach(pil => pil.destroy());
                    });
                    QUESTION.setPilgan_answers(PILGANANSWER);
                }
                if (question_type[index] === "kartu") {
                    let updateQuestion = {
                        question_text: question_text[index],
                        question_img: img,
                        question_type: question_type[index],
                    };
                    const QUESTION = await Question_1.default.findByPk(questId);
                    QUESTION.update(updateQuestion);
                    let card_answers_answers = card_answers[card_answer_index].answers;
                    let Cardanswers = await QUESTION.getCard_answers();
                    let card_answer_answers = await Cardanswers.getAnswers();
                    card_answer_answers.forEach(answer => answer.destroy());
                    let Cardansweranswer = await CardAnswerAnswer_1.default.bulkCreate(card_answers_answers);
                    Cardanswers.setAnswers(Cardansweranswer);
                }
            }
            // IF QUESTION == 1
        }
        else {
            if (question_type == "pilihan_ganda") {
                // // -----------ANSWER IMAGE HANDLE-----------
                const filteredData = req.files.filter((item) => item.fieldname.startsWith("answer_image_"));
                const question_image = req.files.filter((item) => item.fieldname === `question_img`);
                let answers = [correct_answer, ...req.body.wrong_answer];
                let pilgan_answers = answers.map((ans, index) => {
                    let answer_img = filteredData.filter(item => {
                        return item.fieldname == `answer_image_0${index}`;
                    });
                    return {
                        index,
                        answer: ans,
                        image: answer_img[0] !== undefined ? `${req.protocol + "://" + req.get("host")}/files/uploads/${answer_img[0].filename}` : null
                    };
                });
                // ----------END HANDLE---------------
                let Pilgananswer = await PilganAnswer_1.default.bulkCreate(pilgan_answers);
                let questionUpdated = await Question_1.default.findByPk(question_id[0]);
                questionUpdated.update({
                    question_text,
                    question_img: question_image[0] !== undefined
                        ? `${req.protocol + "://" + req.get("host")}/files/uploads/${question_image[0].filename}`
                        : null,
                    question_type,
                });
                await questionUpdated.getPilgan_answers().then(pilgan => {
                    pilgan.forEach(pil => pil.destroy());
                });
                questionUpdated.removePilgan_answers();
                questionUpdated.setPilgan_answers(Pilgananswer);
            }
            else if (question_type == "kartu") {
                let card_answers_questionId = card_answers[0].questionId;
                let card_answers_answers = card_answers[0].answers;
                let newBody = {
                    question_text,
                    question_img: req.files[0] !== undefined
                        ? `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
                        : null,
                    question_type,
                };
                let questionUpdated = await Question_1.default.findByPk(question_id[0]);
                questionUpdated.update(newBody);
                let card_answer = await questionUpdated.getCard_answers();
                let card_answer_answers = await card_answer.getAnswers();
                card_answer_answers.forEach(answer => answer.destroy());
                card_answer.destroy();
                let Cardanswer = await CardAnswer_1.default.create({ questionId: card_answers_questionId });
                let Cardansweranswer = await CardAnswerAnswer_1.default.bulkCreate(card_answers_answers);
                questionUpdated.setCard_answers(Cardanswer);
                Cardanswer.addAnswers(Cardansweranswer);
            }
        }
        (0, response_1.default)(200, "updated exams success", [], res);
    }
    catch (error) {
        console.log(error);
        (0, response_1.default)(500, "server failed to update the exam", { error: error.message }, res);
    }
}
exports.UpdateExam = UpdateExam;
async function GetAllExam(req, res) {
    try {
        const exams = await Exam_1.default.findAll({
            include: [
                { model: Question_1.default, attributes: { exclude: ["ExamUniqueId", "createdAt", "updatedAt", "examId"] }, include: [
                        { model: PilganAnswer_1.default, as: "pilgan_answers", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] } },
                        { model: CardAnswer_1.default, as: "card_answers", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] }, include: [
                                { model: CardAnswerAnswer_1.default, as: "answers", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] } }
                            ] },
                    ] },
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] },
            order: [
                [Question_1.default, { model: PilganAnswer_1.default, as: "pilgan_answers" }, "index", "ASC"],
                [Question_1.default, { model: CardAnswer_1.default, as: "card_answers" }, { model: CardAnswerAnswer_1.default, as: "answers" }, "index", "ASC"]
            ]
        });
        // Send the response with parsed pilgan_answers
        (0, response_1.default)(200, "get all exam data", exams, res);
    }
    catch (error) {
        (0, response_1.default)(500, "server error get all exam", { error: error.message }, res);
    }
}
exports.GetAllExam = GetAllExam;
async function DeleteExam(req, res) {
    try {
        const examId = req.params.id;
        let { allImage, question_unique_id } = req.body;
        allImage = allImage.split(',');
        // DELETE FILE NOT USED
        const filePath = path_1.default.join(__dirname, '..', '..', '..', 'public', 'files', 'uploads');
        if (Array.isArray(allImage) && allImage.length > 0) {
            allImage.forEach((filename) => {
                const fileToDelete = path_1.default.join(filePath, filename);
                if (fs_1.default.existsSync(fileToDelete)) {
                    try {
                        fs_1.default.unlinkSync(fileToDelete);
                        console.log(`File ${filename} deleted successfully.`);
                    }
                    catch (err) {
                        console.error(`Error deleting file ${filename}: ${err}`);
                    }
                }
                else {
                    console.log(`File ${filename} not found.`);
                }
            });
        }
        else {
            console.log('No files to delete.');
        }
        // Delete question when exams deleted
        let question_id = question_unique_id.split(",");
        await Question_1.default.destroy({
            where: {
                unique_id: question_id,
            },
        });
        // DELETE EXAM
        if (!examId)
            return (0, response_1.default)(400, "body can't be undefined", [], res);
        // FIND USER AND DELETE
        const exams = await Exam_1.default.destroy({ where: { unique_id: examId } });
        // CHECK IF USER IS NOT FOUND
        if (!exams)
            return (0, response_1.default)(400, "cant find user with id:" + examId, [], res);
        (0, response_1.default)(200, "delete exam success", exams, res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed delete exam", { error: error.message }, res);
    }
}
exports.DeleteExam = DeleteExam;
async function GetExamById(req, res) {
    try {
        const exam = await Exam_1.default.findByPk(req.params.id, {
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                { model: Question_1.default, attributes: { exclude: ["ExamUniqueId", "createdAt", "updatedAt", "examId"] }, include: [
                        { model: PilganAnswer_1.default, as: "pilgan_answers", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] } },
                        { model: CardAnswer_1.default, as: "card_answers", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] }, include: [
                                { model: CardAnswerAnswer_1.default, as: "answers", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] } }
                            ] },
                    ],
                }
            ],
            order: [
                [Question_1.default, { model: PilganAnswer_1.default, as: "pilgan_answers" }, "index", "ASC"],
                [Question_1.default, { model: CardAnswer_1.default, as: "card_answers" }, { model: CardAnswerAnswer_1.default, as: "answers" }, "index", "ASC"]
            ]
        });
        if (!exam)
            return (0, response_1.default)(200, `no exam found with id: ${req.params.id}`, [], res);
        return (0, response_1.default)(200, "get all exam data", exam, res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed get exam by id", { error: error.message }, res);
    }
}
exports.GetExamById = GetExamById;
//# sourceMappingURL=examController.js.map