const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
console.log("host", process.env.DB_HOST);
// create the connection information for the sql database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// function which prompts the user for what action they should take
const start = () => {
    inquirer
      .prompt({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
                    'View all employee',
                    'View all employees by Department',
                    'View all employees by Manager',
                    'Add employee',
                    'Remove employee',
                    'Update employee Role',
                    'Update employee Manager',
                     'EXIT'
                    ],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        console.log(answer);
         switch (answer.choice) {
            case 'View all employee':
                getAllEmployee();
              break;
            case 'View all employees by Department':
                getEmployeesByDepartment();
              break;  
            case 'View all employees by Manager':
              
              break;
            default:
                connection.end();
          }
                  
      });
  };

  const getAllEmployee = () =>{
    //View all employees
    connection.query(
      "SELECT * FROM employee;",
      
      (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log('Employee list was  created successfully!');
       
        start();
      }
    );
  }
  
  
  const getEmployeesByDepartment = () =>{
    //View all employees
       
    connection.query(
      "SELECT first_name, last_name, name AS department FROM employee "
      + "INNER JOIN role ON (employee.role_id=role.id) "
      + " INNER JOIN department ON (role.department_id=department.id);",
      
      (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log('Employee by department  created successfully!');
       
        start();
      }
    );
  }

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });