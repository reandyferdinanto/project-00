const router = require("express").Router();
const utilsController = require("../../controllers/v1/utilsController");
const { validateToken } = require("../../utils/JWT");

router.post("/upload", validateToken, utilsController.uploadCSV);
router.post("/export", validateToken, utilsController.exportCSV);
router.put("/login-status", utilsController.updateLoginStatus);

module.exports = router;
