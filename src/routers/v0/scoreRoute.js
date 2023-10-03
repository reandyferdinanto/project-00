const router = require("express").Router();
const scoreController = require("../../controllers/v0/scoreController");
const { validateToken } = require("../../utils/JWT");

router.get("/", scoreController.getAllStudents);
router.get("/:id", scoreController.getStudentById);
router.post("/", validateToken, scoreController.addUser);
router.post("/edit", validateToken, scoreController.userEdit);
router.post("/auth", scoreController.userAuth);
router.put("/:id", scoreController.updatePoint);
router.delete("/", validateToken, scoreController.deleteUser);

module.exports = router;
