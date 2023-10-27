const router = require("express").Router();
const utilsController = require("../../controllers/v1/utilsController");
const { validateTokenAPI } = require("../../utils/JWT");

router.post("/upload", validateTokenAPI, utilsController.uploadCSV);
router.post("/export", validateTokenAPI, utilsController.exportCSV);

// no need validate token cause it used for game
router.put("/login-status", utilsController.updateLoginStatus);

module.exports = router;
