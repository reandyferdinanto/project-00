"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class CardAnswerAnswer extends sequelize_1.Model {
}
CardAnswerAnswer.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    index: sequelize_1.DataTypes.INTEGER,
    value: sequelize_1.DataTypes.TEXT,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "cardansweranswer", // Nama tabel di database
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = CardAnswerAnswer;
//# sourceMappingURL=CardAnswerAnswer.js.map