"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../../controllers/v1/adminController");
const JWT_1 = require("../../utils/JWT");
const RateLimiter_1 = __importDefault(require("../../utils/RateLimiter"));
const router = express_1.default.Router();
router.get("/", adminController_1.GetAllAdmin);
router.get("/:id", adminController_1.GetAdminById);
router.post("/register", adminController_1.CreateAdmin);
router.post("/login", RateLimiter_1.default, adminController_1.LoginAdmin);
router.post("/logout", JWT_1.validateTokenAPI, adminController_1.LogoutAdmin);
router.put("/:id", JWT_1.validateTokenAPI, adminController_1.UpdateAdmin);
router.delete("/", JWT_1.validateTokenAPI, adminController_1.DeleteAdmin);
exports.default = router;
//# sourceMappingURL=adminRoute.js.map