const router = require("express").Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.getAllScore);
router.get("/:username", indexController.getScoreByUsername);

router.post("/", indexController.addScore);

module.exports = router;
