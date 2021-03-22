INSERT INTO  department (name) 
VALUES('Sales'),('Engineering'),('Finance'), ('Legal');

INSERT INTO role(title, salary, department_id)
VALUES('Sales Lead', 1000000, 1), 
('Salesperson', 80000, 1), 
('Lead Engineer',1500000,2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Lawyer', 190000, 4),
('Legal Team lead', 250000, 4);

INSERT INTO employee(first_name, last_name, role_id)
VALUES('John', 'Doe', 1),
('Mike','Chan',2),
('Ashley','Rodriguez',3),
('Kevin','Tupik',4),
('Malia','Brown',5),
('Sarah','Lourd',7),
('Tom','Allen',6),
('Christian ','Eckenride',3);

UPDATE Employee  
    SET manager_id =  3
    WHERE  id =1;

UPDATE Employee  
    SET manager_id =  1
    WHERE  id =2;
UPDATE Employee  
    SET manager_id =  3
    WHERE  id =4;
    
UPDATE Employee  
    SET manager_id =  6
    WHERE  id =7;
UPDATE Employee  
    SET manager_id =  2
    WHERE  id =8;