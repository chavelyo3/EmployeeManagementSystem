const mysql = require("mysql");
const inquirer = require("inquirer");
let currentDep = []
let currentEmp = []
let currentRole = []

const logo = require("asciiart-logo");
const config = require("./package.json");

let connection = mysql.createConnection({
  host: "localhost",
  Port: 3306,

  user: "root",

  password: "Cookieandrocky",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected ...");
  startSearch();
});
let asciiBye = `
★─▄█▀▀║░▄█▀▄║▄█▀▄║██▀▄║─★
★─██║▀█║██║█║██║█║██║█║─★
★─▀███▀║▀██▀║▀██▀║███▀║─★
★───────────────────────★
★───▐█▀▄─ ▀▄─▄▀ █▀▀──█───★
★───▐█▀▀▄ ──█── █▀▀──▀───★
★───▐█▄▄▀ ──▀── ▀▀▀──▄───★`
// questions
function startSearch() {
    loadDep();
    loadRole();
    loadEmp();
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "View all Departments",
        "View all Roles",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.choice) {
        case "View all Employees":
          employeeSearch();
          break;

        case "View all Departments":
          departmentSearch();
          break;

        case "View all Roles":
          roleSearch();
          break;

        case "Add Department":
          addDep();
          break;

        case "Add Role":
          addRole();
          break;
            
        case "Add Employee":
          addEmp();
          break;

        case "Update Employee":
          updateEmp();
          break;

        case "Exit":
          console.log(asciiBye)
          console.log(' ')
          connection.end();
          break;
      }
    });
}
// function to view all employees
function employeeSearch() {
  let query = `
    SELECT employee.id, first_name, last_name, title, salary, dep_name, manager_id
    FROM employee
    JOIN roles
    ON role_id = roles.id
    JOIN department
    ON dep_id = department.id;`;
  return connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startSearch();
  });
}

function departmentSearch() {
  let query = `
    SELECT *
    FROM department`;
  return connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startSearch();
  });
}

function roleSearch() {
  let query = "SELECT * FROM roles";
  return connection.query(query, (err, res) => {
    if (err) throw err;
    // console.log(res);
    console.table(res);
    startSearch();
  });
}

function addDep() {
    inquirer.prompt([
        {
            message: "What New Department would you like to add?",
            name: "newDep"
        }
    ]).then(response => {
        let query = `
        INSERT INTO department (dep_name)
        VALUES (?)`
        return connection.query(query, [response.newDep], (err, res)=>{
            if(err)throw err;
            // console.log(res);
            loadDep();
            startSearch();
        })
    })
}

function addRole(){
    inquirer.prompt ([
        {
            message: "What new roles would you like to add?",
            name: "newRole"
        },
        {
            message: "What is their Salary?",
            name:"salary"
        },
        {
            type: "list",
            choices: currentDep,
            message: "Which Department does this role belong to?",
            name: "roleDep"
        }
    ]).then(response => {
        // console.log(response)
        let query = `
        INSERT INTO roles (title, salary, dep_id)
        VALUES (?,?,?)` //("Researcher", 50000.00, 4)
        connection.query(query, [response.newRole, response.salary, (currentDep.indexOf(response.roleDep)+1)],
        (err, res) => {
            if(err) throw err;
            // console.log(res);
            loadRole();
            startSearch();
        })
    })
}

function addEmp(){
  inquirer.prompt([
    {
      message:"What is their first name?",
      name:"newFirst",
    },
    {
      message:"what is thier last name?",
      name:"newLast",
    },
    {
      type:"list",
      message: "what is thier role?",
      choices: currentRole, 
      name:"newRole"
    },
    {
      type:"list",
      message: "Select this person's manager:",
      choices: currentEmp,
      name:"newManager"
    }
  ]).then(response =>{
  let query = `
  INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`
  connection.query(query, [response.newFirst, response.newLast, (currentRole.indexOf(response.newRole)+1), (currentEmp.indexOf(response.newManager)+1)],
  (err, res) => {
      if(err) throw err;
      // console.log(res);
      loadEmp();
      startSearch();
  })

  })
  

}

function updateEmp(){
  inquirer.prompt([
    {
      type: "list",
      choices: currentEmp,
      message: "Which employee would you like to update?",
      name: "empUpdate",
    },

    {
      type: "list",
      choices: currentRole,
      message: "Which role would you like to update?",
      name: "roleUpdate",
    },

  ]).then (response => {
    const query = `UPDATE employee
    SET role_id = ?
    WHERE employee.id = ?`
    return connection.query(query, [currentRole.indexOf(response.roleUpdate)+1, currentEmp.indexOf(response.empUpdate)+1],(err, res)=>{
      if(err)throw err;
      // console.log(res);
      
     console.log("update successful!");
     startSearch();
  })

  })

}


function loadDep(){
  currentDep = [];
  connection.query("SELECT * FROM department", (err, res) => {
    for(i=0; i<res.length;i++){
      currentDep.push(res[i].dep_name)
    }
  })
}

function loadRole(){
 currentRole= [];
 connection.query("SELECT * FROM roles", (err, res) => {
   for(i=0; i<res.length; i++){
     currentRole.push(res[i].title)
   }
 })

}

function loadEmp(){
  currentEmp = [];
  connection.query("SELECT * FROM employee", (err, res)=> {
    for(i=0;i<res.length;i++){
      currentEmp.push(res[i].first_name)
    }
  })
  

}
