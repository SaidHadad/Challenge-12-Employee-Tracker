INSERT INTO deparment (name) VALUES
('Operations Management'),
('Human Resources'),
('Marketing'),
('Finance'),
('IT');

INSERT INTO role (title, salary, deparment_id) VALUES 
('Social Media Specialist', 30000.0, 4)
('Marketing Specialist', 50000.0, 3)
('Database Manager', 55000.0, 5)
('Executive', 100000.0, 1),
('Supervisor', 60000.0, 1),
('Production', 50000.0, 1),
('Accounant', 55000.0, 4),
('Manager', 80000.0, 1),
('Intern', 8000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Benjamin', 'Rodriguez', 3, 8),
('Catalina', 'Hernandez', 2, 4),
('Amaia', 'Garcia', 4, NULL),
('Camila', 'Martinez', 1, 4),
('Lautaro', 'Garcia', 5, 8),
('Dylan', 'Gonzalez', 6, 5),
('Juana', 'Sanchez', 7, 8),
('Cesar', 'Lopez', 9, 3),
('Ian', 'Perez', 8, 4);