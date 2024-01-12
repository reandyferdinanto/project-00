"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const CardAnswerAnswer_1 = __importDefault(require("./CardAnswerAnswer"));
class CardAnswer extends sequelize_1.Model {
}
CardAnswer.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    questionId: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "cardanswer", // Nama tabel di database
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
CardAnswer.hasMany(CardAnswerAnswer_1.default, {
    as: "answers",
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
});
exports.default = CardAnswer;
//# sourceMappingURL=CardAnswer.js.map