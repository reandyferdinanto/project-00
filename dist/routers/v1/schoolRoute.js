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
const School_1 = __importDefault(require("../../models/School"));
const SchoolModule_1 = __importDefault(require("../../models/SchoolModule"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let school = yield School_1.default.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            { model: Module_1.default, as: "modules", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { as: "status", attributes: ["subscribed"] } }
        ]
    });
    if (!school)
        return res.json("school not Found");
    res.json(school);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let schoolId = req.params.id;
    let school = yield School_1.default.findByPk(schoolId, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            { model: Module_1.default, as: "modules", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { as: "status", attributes: ["subscribed"] } }
        ]
    });
    if (!school)
        return res.json("school not Found");
    res.json(school);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let schoolData = req.body;
    try {
        let module = yield Module_1.default.findAll();
        let school = yield School_1.default.create(schoolData);
        school.setModules(module);
        res.json(school);
    }
    catch (error) {
        res.json(error);
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let schoolId = req.params.id;
    let school = yield School_1.default.findByPk(schoolId);
    let moduleId = req.body.moduleId || "";
    let schoolData = req.body;
    try {
        if (school) {
            let modules = yield school.getModules({ where: { unique_id: moduleId } });
            school.update(schoolData);
            if (modules.length !== 0) {
                modules.forEach((module) => __awaiter(void 0, void 0, void 0, function* () {
                    let schoolmodule = yield SchoolModule_1.default.findOne({ where: { ModuleUniqueId: module.unique_id, ownerId: schoolId } });
                    schoolmodule.update({ subscribed: true });
                }));
                return res.send("GG");
            }
            return res.send(school);
        }
        else {
            res.json("School not found");
        }
    }
    catch (error) {
        res.json(error);
    }
}));
exports.default = router;
//# sourceMappingURL=schoolRoute.js.map