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
                getEmployeesByManager();
                break;
            case 'Add employee':
                  addEmployee();
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

  const getEmployeesByManager = () =>{
    //View all employees
       
    connection.query(
       "SELECT a.first_name, a.last_name, concat(b.first_name, ' ', b.last_Name) as manager  "
      + "FROM employee a LEFT JOIN employee b on (a.id=b.manager_id);",

      (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log('Employee by manager  created successfully!');
       
        start();
      }
    );
  }

 
    

    
}

  function getManagerNames() {
    
     connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee WHERE manager_id IS NULL;",
     function (err,res) {
      
      if (err) throw err;
      
      var empArray1=[];
      for (let i =0; i < res.length; i++){
        empArray1.push(res[i].Employee)
      }
      console.log(empArray1);
      return empArray1;
  });
  
  
}



// get manager id
async function getManagerId(managerName){
  let query="SELECT * FROM employee_tracker_db.employee WHERE concat(first_name, ' ', last_Name) =?";
  let pm=[managerName];
  const rows=await connection.query(query,pm);
  return rows[0].id;

}


// add employee
   function addEmployee(){
    
    connection.query("SELECT * FROM role ORDER BY title;",
    function (err, res)  {
      
      
      
            inquirer
            .prompt([
              {
              name: 'firstName',
              type: 'input',
              message: 'What is the employee first name?'
              },
              {name: 'lastName',
              type: 'input',
              message: 'What is the employee last name?'
              },
              {
                name: 'manager',
                type: 'input', 
                message: "What is the employee's manager's ID? ",
                
                 
                    
                },
              
              {name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: function(){
                  var roleArray=[];
                  for(let i=0; i < res.length; i++){
                    roleArray.push(res[i].title);
                  }
                  
                  return roleArray;
                }
                
                },
            
              ]).then (function (answer){
                let roleId;
                for (let i=0; i < res.length; i++){
                  if(res[i].title===answer.role){
                    roleId=res[i].id;
                    console.log(roleId);
                  }

                  
                }

                connection.query('INSERT INTO employee Set ?',
                  {
                    first_name:answer.firstName,
                    last_name:answer.lastName,
                    manager_id:answer.manager,
                    role_id:roleId,
                  }, function(err){
                    if (err) throw err;
                    console.log("emp added")
                    start();
                  }
              
                )
              })
        
    })
  };


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    
    start();
    
  });