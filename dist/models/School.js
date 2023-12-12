"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const Module_1 = __importDefault(require("./Module"));
const SchoolModule_1 = __importDefault(require("./SchoolModule"));
class School extends sequelize_1.Model {
}
School.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    school_id: sequelize_1.DataTypes.STRING,
    school_name: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "school",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
School.belongsToMany(Module_1.default, {
    through: SchoolModule_1.default,
    as: "modules",
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
});
exports.default = School;
//# sourceMappingURL=School.js.map