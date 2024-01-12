"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Admin extends sequelize_1.Model {
}
Admin.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    username: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    role: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    nuptk: sequelize_1.DataTypes.STRING,
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
    tableName: "admin", // Nama tabel di database
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = Admin;
//# sourceMappingURL=Admin.js.map