const router = require("express").Router();
const utilsController = require("../../controllers/v0/utilsController");
const { validateTokenAPI } = require("../../utils/JWT");

router.post("/upload", validateTokenAPI, utilsController.uploadCSV);
router.post("/export", validateTokenAPI, utilsController.exportCSV);

module.exports = router;
