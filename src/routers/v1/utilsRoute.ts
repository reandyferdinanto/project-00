import express from "express";
import { validateTokenAPI } from "../../utils/JWT";
import { UpdateLoginStatus } from "../../controllers/v1/utilsController";

const router = express.Router()

// router.post("/upload", validateTokenAPI, UploadCSV);
// router.post("/export", validateTokenAPI, ExportCSV);

// no need validate token cause it used for game
router.put("/login-status", UpdateLoginStatus);

export default router;
