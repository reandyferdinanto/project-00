const router = require("express").Router();
const scoreController = require("../controllers/scoreController");
const { validateToken } = require("../utils/JWT");

router.get("/", scoreController.getAllScore);
router.get("/:id", scoreController.getScoreById);
router.put("/:username", scoreController.updatePoint);

module.exports = router;
