import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

let sequelize: Sequelize
console.log("ENV_TYPE:", process.env.ENV_TYPE);

if (process.env.ENV_TYPE === 'production') {
  sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
} else {
  console.log("DB run on local");
  // Local configuration
  sequelize = new Sequelize({
    dialect: "mysql",
    host: "127.0.0.1",
    port: 3306, // Specify the default MySQL port
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
  } catch (error) {
    console.error("Koneksi database gagal:", error);
  }
};

export { sequelize, connectToDatabase };



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

