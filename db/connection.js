require('dotenv').config();
const mysql = require("mysql2");

// connect to db
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "employees_db",
  });

module.exports = connection;