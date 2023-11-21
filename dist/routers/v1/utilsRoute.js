"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../../utils/JWT");
const utilsController_1 = require("../../controllers/v1/utilsController");
const router = express_1.default.Router();
router.post("/upload", JWT_1.validateTokenAPI, utilsController_1.UploadCSV);
// router.post("/export", validateTokenAPI, ExportCSV);
// no need validate token cause it used for game
router.put("/login-status", utilsController_1.UpdateLoginStatus);
exports.default = router;
//# sourceMappingURL=utilsRoute.js.map