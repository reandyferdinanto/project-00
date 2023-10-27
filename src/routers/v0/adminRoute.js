const router = require("express").Router();
const adminController = require("../../controllers/v0/adminController");
const { validateTokenAPI } = require("../../utils/JWT");

router.get("/", adminController.getAdmin);
router.get("/:id", adminController.getAdminById);
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout",validateTokenAPI, adminController.logout);
router.put("/",validateTokenAPI, adminController.updateAdmin);
router.put("/password",validateTokenAPI, adminController.resetPassword);
router.delete("/",validateTokenAPI, adminController.deleteAdmin);

module.exports = router;
