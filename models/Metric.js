"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const MetricSchool_1 = __importDefault(require("./MetricSchool"));
class Metric extends sequelize_1.Model {
}
Metric.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    total_student: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    total_exam: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    total_login: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "metric",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
Metric.hasMany(MetricSchool_1.default, {
    sourceKey: "unique_id",
    foreignKey: "ownerId",
    constraints: false,
    as: "metric_school"
});
exports.default = Metric;
//# sourceMappingURL=Metric.js.map