"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../utils/JWT");
const TempData_1 = __importDefault(require("../utils/TempData"));
const Metric_1 = __importDefault(require("../models/Metric"));
const MetricSchool_1 = __importDefault(require("../models/MetricSchool"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({
        postman_docs: "https://documenter.getpostman.com/view/17399437/2s93eYTrCu",
    });
});
router.post('/temp-form-data', JWT_1.validateTokenAPI, (req, res) => {
    const formData = req.body;
    addOrUpdateObject(TempData_1.default, formData);
    res.status(200).json({ message: 'Data formulir disimpan sementara.' });
});
router.get('/temp-form-data', (req, res) => {
    res.status(200).json({ message: 'Data formulir disimpan sementara.', TEMP_DATA: TempData_1.default });
});
router.get("/metrics", async function (req, res) {
    try {
        const metric = await Metric_1.default.findOne({ attributes: { exclude: ["createdAt", "updatedAt", "unique_id"] }, include: [
                { model: MetricSchool_1.default, as: "metric_school", attributes: { exclude: ["createdAt", "updatedAt", "ownerId", "unique_id"] } }
            ] });
        return res.status(200).json(metric);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
function addOrUpdateObject(array, object) {
    const index = array.findIndex((item) => item.id === object.id);
    if (index === -1) {
        array.push(object);
    }
    else {
        array[index] = object;
    }
}
exports.default = router;
//# sourceMappingURL=indexRoute.js.map