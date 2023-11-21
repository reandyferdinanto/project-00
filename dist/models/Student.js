"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const Exam_1 = __importDefault(require("./Exam"));
const StudentExam_1 = __importDefault(require("./StudentExam"));
class Student extends sequelize_1.Model {
}
Student.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    nis: sequelize_1.DataTypes.STRING,
    username: sequelize_1.DataTypes.STRING,
    class: sequelize_1.DataTypes.STRING,
    major: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    role: sequelize_1.DataTypes.STRING,
    gender: sequelize_1.DataTypes.STRING,
    school_id: sequelize_1.DataTypes.STRING,
    school_name: sequelize_1.DataTypes.STRING,
    login_status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: 0,
    },
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "student",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
Student.belongsToMany(Exam_1.default, {
    foreignKey: "score_id",
    through: StudentExam_1.default,
    constraints: false,
});
Exam_1.default.belongsToMany(Student, {
    foreignKey: "exam_id",
    through: StudentExam_1.default,
    constraints: false
});
exports.default = Student;
//# sourceMappingURL=Student.js.map