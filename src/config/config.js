const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/./../../.env") });
module.exports = {
  development: {
    username: "root",
    password: "181001",
    database: "muslim-maya",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  },
};
