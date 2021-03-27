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
                    
                    "View all employee",
                    "View all department",
                    "View all roles",
                    "View all employee's by Department",
                    "View all employee's by Manager",
                    "Add role",
                    "Add Department",
                    "Add employee",
                    "Update employee Role",
                    "Update employee Manager",
                    "Remove employee",
                    "Remove role",
                    "Remove department",
                     'EXIT'
                    ],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        console.log(answer);
         switch (answer.choice) {
            case 'View all employee':
                // getAllEmployee();
                viewQuery('View all employee');
              break;
            case 'View all department':
                viewQuery('View all department');
                 break;
            case 'View all roles':
                viewQuery('View all roles');
                break;
            case "View all employee's by Department":
                viewQuery('View all employees by Department');
                // getEmployeesByDepartment();
              break;  
            case "View all employee's by Manager":
                viewQuery('View all employees by Manager');   
              //  getEmployeesByManager();
                break;
            case 'Add Department':
                  addDepartment();
                  break;  
            case 'Add role':
                  addrole();
                  break;  
            case 'Add employee':
                  addEmployee();
                  break;  
            case  'Update employee Role':
                  updateEmpRole();  
                  break;
            case 'Update employee Manager':
                  updateEmpManager();
                  break;
            case 'Remove employee':
              
                  deleteQuery('employee');
                  break;
            
            case 'Remove role':
              
                  deleteQuery('role');
                  break;
            case 'Remove department':
    
                  deleteQuery('Department');
                  
                  break;
            default:
                connection.end();
          }
                  
      });
  };
// ************************************************
// View data
const viewQuery = (dataPrompt) =>{

  let sqlquery;
  console.log (dataPrompt);
      switch (dataPrompt) 
      {
        case 'View all employee':
            sqlquery="SELECT * FROM employee;"
            break;
        case 'View all department':
            sqlquery="SELECT * FROM department;"
            break;
        case 'View all roles':
            sqlquery="SELECT * FROM role;"   
            break;
        case 'View all employees by Department':

            sqlquery="SELECT first_name, last_name, name AS department FROM employee "
                      + "INNER JOIN role ON (employee.role_id=role.id) "
                      + " INNER JOIN department ON (role.department_id=department.id);"
            console.log (sqlquery);
            break;  
        case 'View all employees by Manager':

            sqlquery="SELECT b.first_name, b.last_name, concat(a.first_name, ' ', a.last_Name) as manager  "
                      + "FROM employee a INNER JOIN employee b on (a.id=b.manager_id);"
            break;
      
      }
  
  //View all employees
  connection.query(
    sqlquery,
    
    (err, res) => {
      if (err) throw err;
      console.table(res);
      console.log('List was  created successfully!');
     
      start();
    }
  );
}

// ***********************************************************************************************

    //  delete query
const deleteQuery = (dataPrompt) =>{

      let sqlquery;
      console.log (dataPrompt);
      switch (dataPrompt) 
      {
        case 'employee':
          sqlSelectQuery="SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS listName FROM employee ;"
          sqlDeleteQuery="DELETE FROM employee WHERE id=?;"
           break;
        
        case 'role':
          sqlSelectQuery="SELECT id, title as listName FROM role;"   
          sqlDeleteQuery="DELETE FROM role WHERE id=?";
          
            break;
        case 'Department':
  
          sqlSelectQuery="SELECT id, name as listName FROM department;"   
          sqlDeleteQuery="DELETE FROM department WHERE id=?"
            
          break;  
        
      }

        //View  employees
        connection.query(sqlSelectQuery,  
        function (err, Res)  {
          inquirer
            .prompt([
              {
                name: 'name',
                type: 'list',
                message: 'Select from list',
                choices: function(){
                      var lstArray=[];
                      console.log(Res.length)
                      for(let i=0; i < Res.length; i++){
                        lstArray.push(Res[i].listName);
                      }
                      
                      return lstArray;
                    }
                
                },
            
                   ]).then(function(answer){
                            let lstId;
                            for (let i=0; i < Res.length; i++){
                                  if(Res[i].listName===answer.name){
                                    lstId=Res[i].id;
                                    console.log(lstId);
                                  }

                            }
                            console.log (sqlDeleteQuery);
                            connection.query(sqlDeleteQuery,
                            [lstId]
                            , function(err){
                              if (err) throw err;
                              console.log("Record deleted")
                              start();
                            }
                    
                          )
                  })
      })
}





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
  let query="SELECT * FROM employee WHERE concat(first_name, ' ', last_Name) =?";
  let pm=[managerName];
  const rows=await connection.query(query,pm);
  return rows[0].id;

}
// add role

function addrole(){
    
  connection.query("SELECT * FROM department ORDER BY name;",
  function (err, res)  {
 
    
          inquirer
          .prompt([
                {
                name: 'role',
                type: 'input',
                message: 'Input role title?'
                },

                {
                  name: 'Salary',
                  type: 'input',
                  message: 'Input salary for the current role?'
                  },

                {
                  name: 'department',
                  type: 'list',
                  message: "Select Department?",
                  choices: function(){
                  var depArray=[];
                  for(let i=0; i < res.length; i++){
                    depArray.push(res[i].name);
                  }
                  
                  return depArray;
                }
                
                },
        
          
            ]).then (function (answer){
              
              let depId;
              for (let i=0; i < res.length; i++){
                if(res[i].name===answer.department){
                  depId=res[i].id;
                  console.log(depId);
                }

                
              }

              connection.query('INSERT INTO role Set ?',
                {
                  title:answer.role,
                  salary:answer.Salary,
                  department_id:depId,
                  
                }, function(err){
                  if (err) throw err;
                  console.log("Role Added")
                  start();
                }
            
              )
            })
      
   })
};
// Add Department

function addDepartment(){
  
          inquirer
          .prompt([
            {
            name: 'name',
            type: 'input',
            message: 'Input department name?'
            },
           

            
          
            ]).then (function (answer){
              

              connection.query('INSERT INTO department Set ?',
                {
                  name:answer.name,
                  
                }, function(err){
                  if (err) throw err;
                  console.log("Department added")
                  start();
                }
            
              )
            })
      
  // })
};


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
  
  const updateEmpRole = () =>{

      connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ;",  
          function (err, empRes)  {
            inquirer
              .prompt([
                {
                  name: 'name',
                  type: 'list',
                  message: 'Select employee?',
                  choices: function(){
                        var empArray=[];
                        console.log(empRes.length)
                        for(let i=0; i < empRes.length; i++){
                          empArray.push(empRes[i].Employee);
                        }
                        
                        return empArray;
                      }
                  
                  },
              
                ]).then(function(answer){
                              let empId;
                              for (let i=0; i < empRes.length; i++){
                                    if(empRes[i].Employee===answer.name){
                                      empId=empRes[i].id;
                                      console.log(empId);
                                    }

                              }
                          connection.query("SELECT * FROM role ORDER BY title;",
                          function (err, res)  {
                              inquirer
                              .prompt([
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

                                    connection.query('UPDATE employee SET role_id=? WHERE id=?;',
                                      [roleId, empId]
                                      , function(err){
                                        if (err) throw err;
                                        console.log("Employee role updated")
                                        start();
                                      }
                              
                                    )
                              })

                          })
                  
              })
      })
  }



  const updateEmpManager = () =>{

    connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ;",  
        function (err, empRes)  {
          inquirer
            .prompt([
              {
                name: 'name',
                type: 'list',
                message: 'Select employee?',
                choices: function(){
                      var empArray=[];
                      console.log(empRes.length)
                      for(let i=0; i < empRes.length; i++){
                        empArray.push(empRes[i].Employee);
                      }
                      
                      return empArray;
                    }
                
                },
            
              ]).then(function(answer){
                            let empId;
                            for (let i=0; i < empRes.length; i++){
                                  if(empRes[i].Employee===answer.name){
                                    empId=empRes[i].id;
                                    console.log(empId);
                                  }

                            }
                        connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee WHERE manager_id IS NULL;",
                        function (err, res)  {
                            inquirer
                            .prompt([
                                  {name: 'manager',
                                    type: 'list',
                                    message: "Select employee's manager?",
                                    choices: function(){
                                      var eArray=[];
                                      for(let i=0; i < res.length; i++){
                                        eArray.push(res[i].Employee);
                                      }
                                      
                                      return eArray;
                                    }
                                    
                                    },
                                  ]).then (function (answer){
                                    let managerId;
                                    for (let i=0; i < res.length; i++){
                                      if(res[i].Employee===answer.manager){
                                        managerId=res[i].id;
                                        console.log(managerId);
                                      }

                                      
                                    }

                                  connection.query('UPDATE employee SET manager_id=? WHERE id=?;',
                                    [managerId, empId]
                                    , function(err){
                                      if (err) throw err;
                                      console.log("Employee role updated")
                                      start();
                                    }
                            
                                  )
                            })

                        })
                
            })
    })
}

// connect to the mysql server and sql database



connection.connect((err) => {


    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    
    start();
    
  });