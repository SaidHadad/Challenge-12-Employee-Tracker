// import npm dependencies
const inquirer = require("inquirer");
const LogTable = require("console.table");
const separator = require("choices-separator");
const connection = require("./db/connection");

// import respective files from src folder
// role = require("./src/role");
// employee = require("./src/employee");
// department = require("./src/department");

function beginPrompt() {
  inquirer.prompt([
    {
      name: "mainPrompt",
      type: "list",
      message: "What would you like to do?",
      choices: [
        new separator ("======== View ========="),
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "View all Employees by Department",
        "View all Employees by Manager",
        new separator ("======== Add ========="),
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        new separator ("======== Update ========="),
        "Update an Employee Role",
        new separator ("======== Delete ========="),
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        new separator("=========================="),
        "Finish",
      ]
    }
  ])
  .then (function (res) {
    switch (res.mainPrompt) {
      case "View all Departments":
        viewDept();
      break;
      case "View all Roles":
        viewRoles();
      break;
      case "View all Employees":
        viewEmployees();
      break;
      case "View all Employees by Department":
        viewEmployeesDepartment();
      break;
      case "View all Employees by Manager":
        viewEmployeesManager();
      break;
      case "Add a Department":
        addDepartment();
      break;
      case "Add a Role":
        addRole();
      break;
      case "Add an Employee":
        addEmployee();
      break;
      case "Update an Employee Role":
        updateEmployee();
      break;
      case "Delete a Department":
        deleteDepartment();
      break;
      case "Delete a Role":
        deleteRole();
      case "Delete an Employee":
        deleteEmployee();
      case "Finish":
          console.log("You are done!");
      break;
    };
  });
};

// =========================================== VIEW ==================================
function viewDept() {
  connection.query(`SELECT * FROM department;`, function (err, res) {
      if (err) throw err;
      console.table(res);
      beginPrompt();
  });
};

function viewRoles() {
  connection.query(`SELECT * FROM role;`, function (err, res) {
    if (err) throw err;
    console.table(res);
    beginPrompt();
  });
};

function viewEmployees() {
  connection.query(`SELECT * FROM employees;`, function (err, res) {
    if (err) throw err;
    console.table(res);
    beginPrompt();
  });
};

function viewEmployeesDepartment() {
  connection.query(`SELECT * FROM department;`, function (err, res) {
    const choices = res.map(({id, name}) => ({
      name: name,
      value: id
    }));
    const { departmentPrompt } = inquirer.prompt([
      {
        name: "departmentPrompt",
        type: "list",
        message: "Select the Department",
        choices: choices
      }
    ]).then(({departmentPrompt}) => {
      connection.query(`
      SELECT employees.first_name, employees.last_name, role.title, department.name AS department FROM employees
      LEFT JOIN role ON employees.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      WHERE department.id = ${departmentPrompt};`, function (err, employees) {
        if (err) throw err;
        console.table(employees);
        beginPrompt();
      });
    });
  });
};

function viewEmployeesManager() {
  connection.query(`SELECT * FROM employees;`, function (err, res) {
    const choices = res.map(({id, first_name, last_name}) => ({
      name: first_name + " " + last_name,
      value: id
    }));
    const { managerPrompt } = inquirer.prompt([
      {
        name: "managerPrompt",
        type: "list",
        message: "Select the Manager",
        choices: choices
      }
    ]).then(({managerPrompt}) => {
      connection.query(`
      SELECT ER.first_name, ER.last_name, ER.manager_id, role.title, department.name, mgr.first_name AS manager FROM employees ER
      LEFT JOIN role ON role.id = ER.role_id
      LEFT JOIN department ON department.id = role.department_id
      LEFT JOIN employees mgr ON ER.manager_id = MGR.role_id
      WHERE ER.manager_id = ${managerPrompt};`, function (err, employees) {
        if (err) throw err;
        console.table(employees);
        beginPrompt();
      });
    });
  });
};

// ==================================== ADD =========================================

function addDepartment() {
  const { departmentPrompt } = inquirer.prompt([
    {
      name: "departmentPrompt",
      type: "input",
      message: "Name of the Department you are adding:"
    }
  ]).then(({departmentPrompt}) => {
    connection.query(`
    INSERT INTO department (name) VALUES ("${departmentPrompt}");`, function (err, employees) {
      if (err) throw err;
      console.log("Department added successfully")
      beginPrompt();
    });
  });
};

function addRole() {
  connection.query(`SELECT * FROM department;`, function (err, res) {
    const choices = res.map(({id, name}) => ({
      name: name,
      value: id
    }));
    inquirer.prompt([
      {
        name: "rolePrompt",
        type: "input",
        message: "Name of the role you are adding:"
      },
      {
        name: "salaryPrompt",
        type: "input",
        message: "Salary of the role you are adding:"
      },
      {
        name: "deptPrompt",
        type: "list",
        message: "Select the department this role is part of:",
        choices: choices
      }
    ]).then(function (res) {
      connection.query(`INSERT INTO role (title, salary, department_id)
      VALUES ("${res.rolePrompt}", "${res.salaryPrompt}", "${res.deptPrompt}");`);
      console.log("Department added successfully")
      beginPrompt();
    });
  });
};
  
function addEmployee() {
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What's the employee first name?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What's the employee last name?"
    }
  ]).then(function (firstPrompt) {
    connection.query(`SELECT * FROM employees;`, function (err, res) {
      const managers = res.map(({id, first_name, last_name}) => ({
        name: first_name + " " + last_name,
        value: id
      }));
      inquirer.prompt([
        {
          name: "manager",
          type: "list",
          message: "Who's the employee's manager",
          choices: managers
        }
      ]).then(function (secondPrompt) { 
          connection.query(`SELECT * FROM role;`, function (err, res) {
            const roles = res.map(({id, title}) => ({
              name: title,
              value: id
            }));
            inquirer.prompt([
              {
                name: "role",
                type: "list",
                message: "What's the employee role",
                choices: roles
              }
            ]).then(function (thirdPrompt) {
              console.log(firstPrompt.firstName, firstPrompt.lastName, thirdPrompt.role, secondPrompt.manager);
              connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ("${firstPrompt.firstName}", "${firstPrompt.lastName}", "${thirdPrompt.role}", "${secondPrompt.manager}");`);
                console.log("Employee added successfully");
                beginPrompt();
            });
          });
      });
    });
  });
};

// ==================================== UPDATE =========================================

function updateEmployee() {
  console.log('hola');
  connection.query(`SELECT * FROM employees;`, function (err, res) {
    const choices = res.map(({id, first_name, last_name}) => ({
      name: first_name + " " + last_name,
      value: id
    }));
  inquirer.prompt([
    {
      name: "name",
      type: "list",
      message: "Select the employee you want to be updated:",
      choices: choices
    },
    {
      name: "role",
      type: "input",
      message: "Enter the new role ID for that employee"
    },
  ]).then(function(res){
    let employee = res.name;
    console.log(employee);
    let role = res.role;
    connection.query(`UPDATE employees set role_id = "${role}" WHERE id = "${employee}";`)
    console.log('The employee has been updated!')
    beginPrompt();
    });
  });
};

// ==================================== DELETE =========================================

function deleteDepartment() {
  connection.query(`SELECT * FROM department;`, function (err, res) {
    const choices = res.map(({id, name}) => ({
      name: name,
      value: id
    }));
    inquirer.prompt([
      {
        name: "department",
        type: "list",
        message: "Please select the department you want to delete:",
        choices: choices,
      }
    ]).then(function(res) {
      connection.query(`DELETE FROM department WHERE id = ${res.department};`, function (err, res) {
        if (err) throw err;
        console.log('Department deleted');
      });
    });
  });
};

function deleteRole() {
  connection.query(`SELECT * from role;`, function (err, res) {
    const choices = res.map(({id, title}) => ({
      name: title,
      value: id
    }));
    inquirer.prompt([
      {
        name: "role",
        type: "list",
        message: "Please select the role you want to delete:",
        choices: choices,
      }
    ]).then(function(res) {
      connection.query(`DELETE FROM role WHERE id = ${res.role};`, function (err, res) {
        if (err) throw err;
        console.log('Department deleted');
      });
    });
  });
};
beginPrompt();