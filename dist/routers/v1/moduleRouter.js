"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Module_1 = __importDefault(require("../../models/Module"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let module = yield Module_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
    if (!module)
        return res.json("Module not Found");
    res.json(module);
}));
router.get("/:module_name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let module = yield Module_1.default.findOne({ where: { module_name: req.params.module_name } });
    if (!module)
        return res.json("Module not Found");
    res.json(module);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let moduleData = req.body;
    try {
        yield Module_1.default.create(moduleData).then(function () {
            res.json("SUCCESS CREATE NEW MODULE");
        });
    }
    catch (error) {
        res.json(error);
    }
}));
exports.default = router;
//# sourceMappingURL=moduleRouter.js.map