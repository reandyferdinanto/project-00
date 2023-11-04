const router = require("express").Router();
const adminController = require("../../controllers/v1/adminController");
const limiter = require("../../utils/RateLimiter");
const {validateTokenAPI} = require("../../utils/JWT");

router.get("/", adminController.getAllAdmin);
router.get("/:id", adminController.getAdminById);
router.post("/register", adminController.register);
router.post("/login",limiter, adminController.login);
router.post("/logout",validateTokenAPI, adminController.logout);
router.put("/:id",validateTokenAPI, adminController.updateAdmin);
router.delete("/",validateTokenAPI, adminController.deleteAdmin);

module.exports = router;
