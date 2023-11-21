import express from "express"
import {CreateAdmin, DeleteAdmin, GetAdminById, GetAllAdmin, LoginAdmin, LogoutAdmin, UpdateAdmin } from "../../controllers/v1/adminController";
import { validateTokenAPI } from "../../utils/JWT";
import limiter from "../../utils/RateLimiter";

const router = express.Router()

router.get("/", GetAllAdmin);
router.get("/:id", GetAdminById);
router.post("/register", CreateAdmin);
router.post("/login",limiter, LoginAdmin);
router.post("/logout",validateTokenAPI, LogoutAdmin);
router.put("/:id",validateTokenAPI, UpdateAdmin);
router.delete("/",validateTokenAPI, DeleteAdmin);

export default router;
