const sql = require("mysql");
const inquirer = require("inquier");


let connection = mysql.createConnection({
    host: "localhost",
    Port: 3306,
    
    user: "root",

    password: "cookieandrocky",
    database: "employee_tracker_db",
})

connection.connect(function(err){
    if(err)throw err;
    console.log("connected ...")
    startSearch();
})


// questions 
function startSearch(){
    inquirer
    .prompt(
        {
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choice: [
                "View all Employees",
                "View all Departments",
                "View all Roles",
                "Add Employess",
                "Exit",
            ]

        })
.then(function(answer){
    switch (answer.action){

        case "View all Employees":
            employeeSearch();
            break;


            case "View all Departments":
                departmentSearch();
                break;

                case "View all Roles":
                    roleSearch();
                    break;

                    case "Add Employees":
                        addEmployees();
                        break;

                        case "Exit":
                            connection.end();
                            break;
    }
});

}

function employeeSearch(){
    let query = "SELECT.."
    return connection.query(query, function(err,res){
        if (err) throw err;
            startSearch();
    });
}

