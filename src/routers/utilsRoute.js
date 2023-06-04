const router = require("express").Router();
const utilsController = require("../controllers/utilsController");
const { validateToken } = require("../utils/JWT");

router.post("/upload", validateToken, utilsController.uploadCSV);
router.post("/export", validateToken, utilsController.exportCSV);

module.exports = router;
