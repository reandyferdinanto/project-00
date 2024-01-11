"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const Question_1 = __importDefault(require("./Question"));
class Exam extends sequelize_1.Model {
}
Exam.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    exam_name: sequelize_1.DataTypes.STRING,
    exam_type: sequelize_1.DataTypes.STRING,
    kkm_point: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    available_try: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 2,
    },
    school_id: sequelize_1.DataTypes.STRING,
    school_name: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "exam", // Nama tabel di database
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
Exam.hasMany(Question_1.default, {
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
});
exports.default = Exam;
//# sourceMappingURL=Exam.js.map