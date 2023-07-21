const router = require("express").Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdmin);
router.get("/:id", adminController.getAdminById);
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.put("/", adminController.updateAdmin);
router.put("/password", adminController.resetPassword);
router.delete("/", adminController.deleteAdmin);

module.exports = router;
