DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS deparment;

-- CREATE deparment table first because role has a dependency on deparment id
CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- next role table because employee has a dependency on role_id and deparment_id
CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8, 1),
    department_id INTEGER,
    -- constraint to make deparment_id dependent on deparment table and set to null if register is deleted on deparment table
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER NULL
);