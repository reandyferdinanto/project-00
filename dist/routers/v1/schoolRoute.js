"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Module_1 = __importDefault(require("../../models/Module"));
const School_1 = __importDefault(require("../../models/School"));
const SchoolModule_1 = __importDefault(require("../../models/SchoolModule"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    let school = await School_1.default.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            { model: Module_1.default, as: "modules", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { as: "status", attributes: ["subscribed"] } }
        ]
    });
    if (!school)
        return res.json("school not Found");
    res.json(school);
});
router.get("/:id", async (req, res) => {
    let schoolId = req.params.id;
    let school = await School_1.default.findByPk(schoolId, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            { model: Module_1.default, as: "modules", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { as: "status", attributes: ["subscribed"] } }
        ]
    });
    if (!school)
        return res.json("school not Found");
    res.json(school);
});
router.post('/', async (req, res) => {
    let schoolData = req.body;
    try {
        let module = await Module_1.default.findAll();
        let school = await School_1.default.create(schoolData);
        school.setModules(module);
        res.json(school);
    }
    catch (error) {
        res.json(error);
    }
});
router.put("/:id", async (req, res) => {
    let schoolId = req.params.id;
    let school = await School_1.default.findByPk(schoolId);
    let moduleId = req.body.moduleId || "";
    let schoolData = req.body;
    try {
        if (school) {
            let modules = await school.getModules({ where: { unique_id: moduleId } });
            school.update(schoolData);
            if (modules.length !== 0) {
                modules.forEach(async (module) => {
                    let schoolmodule = await SchoolModule_1.default.findOne({ where: { ModuleUniqueId: module.unique_id, ownerId: schoolId } });
                    schoolmodule.update({ subscribed: true });
                });
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
});
exports.default = router;
//# sourceMappingURL=schoolRoute.js.map