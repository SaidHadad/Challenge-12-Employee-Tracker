const mysql = require("mysql2");
const util = require("util");
require('dotenv').config();

// connect to db
const connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "employees_db",
    port: 3306,
  }
);

connection.connect();
// Setting up connection.query to use promises instead of callbacks
connection.query = util.promisify(connection.query);

module.exports = connection;