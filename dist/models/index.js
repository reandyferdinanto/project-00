"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let sequelize;
if (process.env.ENV_TYPE == 'production') {
    exports.sequelize = sequelize = new sequelize_1.Sequelize({
        dialect: "mysql",
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}
else {
    console.log("DB run on local");
    // Konfigurasi koneksi database Anda
    exports.sequelize = sequelize = new sequelize_1.Sequelize({
        dialect: "mysql",
        host: "127.0.0.1",
        username: "root",
        password: "1234",
        database: "muslim-maya",
        logging: false,
    });
}
// Fungsi untuk menghubungkan ke database
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Model-model disinkronkan dengan database.");
    }
    catch (error) {
        console.error("Koneksi database gagal:", error);
    }
};
exports.connectToDatabase = connectToDatabase;
// import { Sequelize } from "sequelize";
// const sequelize = new Sequelize({
//   dialect: "mysql",
//   host: "mysql-9309b94-r-database.a.aivencloud.com",
//   port: 24416,
//   username: "avnadmin",
//   password: "AVNS_OP-WB1Y5niLQBenGZKl",
//   database: "muslim-maya",
//   dialectOptions: {
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });
// // Function to connect to the database
// const connectToDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     console.log("Models synchronized with the database.");
//   } catch (error) {
//     console.error("Database connection failed:", error);
//   }
// };
// export { sequelize, connectToDatabase };
//# sourceMappingURL=index.js.map