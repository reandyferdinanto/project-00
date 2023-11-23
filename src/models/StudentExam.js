"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class StudentExam extends sequelize_1.Model {
}
StudentExam.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    point: sequelize_1.DataTypes.TEXT,
    number_of_try: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "studentexam",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = StudentExam;
//# sourceMappingURL=StudentExam.js.map