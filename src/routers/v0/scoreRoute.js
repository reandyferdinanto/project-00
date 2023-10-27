const router = require("express").Router();
const scoreController = require("../../controllers/v0/scoreController");
const { validateTokenAPI } = require("../../utils/JWT");

router.get("/", scoreController.getAllStudents);
router.get("/:id", scoreController.getStudentById);
router.post("/", validateTokenAPI, scoreController.addUser);
router.post("/edit", validateTokenAPI, scoreController.userEdit);
router.post("/auth", scoreController.userAuth);
router.put("/:id", scoreController.updatePoint);
router.delete("/", validateTokenAPI, scoreController.deleteUser);

module.exports = router;
