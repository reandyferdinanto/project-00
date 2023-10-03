const router = require("express").Router();
const studentController = require("../../controllers/v1/studentController");
const { validateToken } = require("../../utils/JWT");

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", validateToken, studentController.addUser);
router.post("/edit", validateToken, studentController.userEdit);
router.post("/auth", studentController.userAuth);
router.put("/:id", studentController.updatePoint);
router.delete("/", validateToken, studentController.deleteUser);

module.exports = router;
