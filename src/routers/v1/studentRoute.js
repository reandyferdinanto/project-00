const router = require("express").Router();
const studentController = require("../../controllers/v1/studentController");
const { validateTokenAPI } = require("../../utils/JWT");

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", validateTokenAPI, studentController.addUser);
router.post("/edit", validateTokenAPI, studentController.userEdit);

// no need validate token cause it used for game
router.post("/auth", studentController.userAuth);
// no need validate token cause it used for game
router.put("/:id", studentController.updatePoint);

router.delete("/", validateTokenAPI, studentController.deleteUser);

module.exports = router;
