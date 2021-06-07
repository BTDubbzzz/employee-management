const mysql = require('mysql');
const inquirer = require('inquirer');
const questions = require('./src/questions');

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'employees_db',
});

function homePage() {
	inquirer.prompt(questions.homePageQuestions).then((res) => {
		const answer = res.homeChoice;
		switch (answer) {
			case 'Add department':
				addDepartmentPrompts();
				break;
			case 'Add role':
				addRolePrompts();
				break;
			case 'Add employee':
				addEmployeePrompts();
				break;
			case 'View departments':
				viewDepartments();
				break;
			case 'View roles':
				viewRoles();
				break;
			case 'View all employees':
				viewAllEmployees();
				break;
			case 'View all employees by manager':
				viewEmployeesByManager();
				break;
			case 'Update employee roles':
				updateEmployeeRole();
				break;
			case 'Remove employee':
				removeEmployee();
				break;
			case 'Exit':
				connection.end();
				break;
		}
	});
}

function addDepartmentPrompts() {
	inquirer.prompt(questions.addDepartmentQuestions).then((res) => {
		connection.query(
			`INSERT INTO department SET ?`,
			{
				name: res.departmentName,
			},
			(err) => {
				if (err) throw err;
				console.log(`You have created new department: ${res.departmentName}`);
				homePage();
			}
		);
	});
}
function addRolePrompts() {
	connection.query(
		'SELECT id, name AS department FROM department',
		(err, results) => {
			console.table(results);
			results.forEach((element) => {
				console.log('element :>> ', element);
			});
			inquirer
				.prompt([
					...questions.addRoleQuestions,
					{
						message: 'Please choose the department for this role',
						type: 'list',
						name: 'roleDepartmentName',
						choices() {
							const choiceArray = [];
							results.forEach((element) => {
								choiceArray.push(element.department);
							});
							return choiceArray;
						},
					},
				])
				.then((res) => {
					console.log('res :>> ', res);
					const chosenDepartmentID = results.filter(
						(object) => object.department === res.roleDepartmentName
					)[0];
					connection.query(
						`INSERT INTO role SET ?`,
						{
							title: res.roleName,
							salary: res.roleSalary,
							department_id: chosenDepartmentID.id,
						},
						(err) => {
							if (err) throw err;
							console.log(`You succesfully created new role: ${res.roleName}`);
							homePage();
						}
					);
				});
		}
	);
}
function addEmployeePrompts() {
	connection.query(
		`SELECT
		id,
		title AS role
		FROM role`,
		(err, results) => {
			console.log('results :>> ', results);
			connection.query(
				`SELECT
				id,
				CONCAT(first_name,' ', last_name) AS manager
				FROM employee`,
				(err, data) => {
					console.log('data :>> ', data);

					inquirer
						.prompt([
							...questions.addEmployeeQuestions,
							{
								message: 'Please choose employee role',
								type: 'list',
								name: 'employeeRole',
								choices() {
									const choiceArray = [];
									results.forEach((element) => {
										choiceArray.push(element.role);
									});
									return choiceArray;
								},
							},
							{
								message: "Please choose the employee's manager",
								type: 'list',
								name: 'employeeManager',
								choices() {
									const choiceArray2 = ['No Manager'];
									data.forEach((element) => {
										choiceArray2.push(element.manager);
									});
									return choiceArray2;
								},
							},
						])
						.then((res) => {
							console.log('res :>> ', res);
							const chosenRole = results.filter(
								(object) => object.role === res.employeeRole
							)[0];
							let chosenManager = data.filter(
								(object) => object.manager === res.employeeManager
							)[0];
							if (res.employeeManager === 'No Manager') {
								chosenManager = 'NULL';
								chosenManager.id = 'NULL';
							}

							console.log('chosenRole :>> ', chosenRole);
							console.log('chosenManager :>> ', chosenManager);

							connection.query(
								`INSERT INTO employee SET ?`,
								{
									first_name: res.employeeFirstName,
									last_name: res.employeeLastName,
									role_id: chosenRole.id,
									manager_id: chosenManager.id,
								},
								(err) => {
									if (err) throw err;
									console.log(
										`You succesfully created new employee: ${
											res.employeeFirstName + res.employeeLastName
										}`
									);
									homePage();
								}
							);
						});
				}
			);
		}
	);
}
function viewDepartments() {
	connection.query(
		'SELECT id, name AS department FROM department',
		(err, results) => {
			console.table(results);
			homePage();
		}
	);
}
function viewRoles() {
	connection.query(
		`SELECT 
		role.id, 
		role.title AS role, 
		role.salary,
		department.name AS department
		FROM role
		JOIN department
		ON role.department_id = department.id`,
		(err, results) => {
			console.table(results);
			homePage();
		}
	);
}
function viewAllEmployees() {
	connection.query(
		`SELECT 
		employee.id, 
		employee.first_name, 
		employee.last_name, 
		role.title, 
		department.name AS department, 
		role.salary, 
		CONCAT(manager.first_name,' ', manager.last_name) AS manager 
		FROM employee 
		JOIN role 
		ON employee.role_id = role.id 
		JOIN department 
		ON role.department_id = department.id 
		LEFT JOIN employee AS manager 
		ON employee.manager_id = manager.id`,
		(err, results) => {
			console.table(results);
			homePage();
		}
	);
}
function viewEmployeesByManager() {
	connection.query(
		`SELECT DISTINCT
		employee.manager_id,
		CONCAT(manager.first_name,' ', manager.last_name) AS manager
		FROM employee
		LEFT JOIN employee AS manager
		ON employee.manager_id = manager.id
		WHERE employee.manager_id IS NOT NULL`,
		(err, results) => {
			inquirer
				.prompt([
					{
						message: 'Choose the Manager to see their employees',
						type: 'list',
						name: 'managerOfEmployees',
						choices() {
							const choiceArray = [];
							results.forEach((element) => {
								choiceArray.push(element.manager);
							});
							return choiceArray;
						},
					},
				])
				.then((res) => {
					const chosenManager = results.filter(
						(object) => object.manager === res.managerOfEmployees
					)[0];
					connection.query(
						`SELECT
						employee.first_name,
						employee.last_name, 
						CONCAT(manager.first_name,' ', manager.last_name) AS manager
						FROM employee
						LEFT JOIN employee AS manager 
						ON 
						employee.manager_id = manager.id
						WHERE employee.manager_id = ${chosenManager.manager_id}`,
						(err, results) => {
							// console.log('results :>> ', results);
							console.table(results);
							homePage();
						}
					);
				});
		}
	);
}
function updateEmployeeRole() {
	console.log('u r');
	inquirer
		.prompt(questions.updateRoleQuestions)
		.then((res) => console.log('res :>> ', res))
		.then(function () {
			homePage();
		});
}
function removeEmployee() {
	console.log('r e');
	inquirer
		.prompt(questions.removeEmployeeQuestions)
		.then((res) => console.log('res :>> ', res))
		.then(function () {
			homePage();
		});
}

connection.connect((err) => {
	if (err) throw err;
	homePage();
});
