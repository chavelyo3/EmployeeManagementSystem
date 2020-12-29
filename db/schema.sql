DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
	id INT AUTO_INCREMENT,
    dep_name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles (
	id INT AUTO_INCREMENT,
	title VARCHAR(30),
    salary DECIMAL(10,2),
    dep_id INT,
    PRIMARY KEY (id),
	FOREIGN KEY (dep_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INT AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id)
);