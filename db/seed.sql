USE employee_tracker_db;

INSERT INTO department (dep_name)
VALUES ("Engineering"),
("Sales"),
("Marketing");

INSERT INTO roles (title, salary, dep_id)
VALUES ("Data Engineer", 75000.00, 1),
("Marketing Specialist", 65000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Roxette", "Banos", 2, NULL);