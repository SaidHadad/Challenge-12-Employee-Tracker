inquirer = require("inquirer");
const connection = require("../db/connection");

function viewDept() {
  connection.query(
    `SELECT * FROM department;`, function (err, res) {
    if (err) throw err;
    console.log("\n")
    console.table(res);
  });
};

module.exports = {
  viewDept
};