"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const PilganAnswer_1 = __importDefault(require("./PilganAnswer"));
const CardAnswer_1 = __importDefault(require("./CardAnswer"));
class Question extends sequelize_1.Model {
}
Question.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    question_type: sequelize_1.DataTypes.STRING,
    question_text: sequelize_1.DataTypes.TEXT,
    question_img: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "question", // Nama tabel di database
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
Question.hasMany(PilganAnswer_1.default, {
    as: "pilgan_answers",
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
});
Question.hasOne(CardAnswer_1.default, {
    as: "card_answers",
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
});
exports.default = Question;
//# sourceMappingURL=Question.js.map