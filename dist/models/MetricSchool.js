"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class MetricSchool extends sequelize_1.Model {
}
MetricSchool.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    student_counter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    exam_counter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    login_counter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    school_id: sequelize_1.DataTypes.STRING,
    school_name: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "metricschool", // Nama tabel di database
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = MetricSchool;
//# sourceMappingURL=MetricSchool.js.map