const router = require("express").Router();
const scoreController = require("../controllers/scoreController");
const { validateToken } = require("../utils/JWT");

router.get("/", scoreController.getAllScore);
router.get("/:id", scoreController.getScoreById);
router.post("/", validateToken, scoreController.addUser);
router.post("/edit", validateToken, scoreController.userEdit);
router.post("/auth", scoreController.userAuth);
router.put("/:id", scoreController.updatePoint);
router.delete("/", validateToken, scoreController.deleteUser);

module.exports = router;
