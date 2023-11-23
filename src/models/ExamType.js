"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class ExamType extends sequelize_1.Model {
}
ExamType.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    exam_type: sequelize_1.DataTypes.STRING,
    tanggal_dibuat: sequelize_1.DataTypes.STRING,
    school_id: sequelize_1.DataTypes.STRING,
    school_name: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "examtype",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = ExamType;
//# sourceMappingURL=ExamType.js.map