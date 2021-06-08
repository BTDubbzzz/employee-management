const mysql = require('mysql');
const inquirer = require('inquirer');
const questions = require('./src/questions');
const cTable = require('console.table');
const queries = require('./src/queries');
const messages = require('./src/messages');

const ROLE = 'role';
const DEPARTMENT = 'department';
const EMPLOYEE = 'employee';
const MANAGER = 'manager';
const CREATED = 'created';
const DELETED = 'deleted';
const UPDATED = 'updated';
const DELETE = 'delete';
const GIVE = 'give to this employee';
const UPDATE_MANAGER = 'update their manager';
const UPDATE_ROLE = 'update their role';
const VIEW_EMPLOYEES = 'view their employees';

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'employees_db',
});

function createListQuestion(
	LIST_PARAM_1,
	LIST_PARAM_2,
	NAME_PARAM,
	PROPERTY_PARAM,
	results,
	ARRAY_PARAM
) {
	const object = {
		message: messages.listMessage(LIST_PARAM_1, LIST_PARAM_2),
		type: 'list',
		name: NAME_PARAM,
		choices() {
			results.forEach((element) => {
				ARRAY_PARAM.push(element[PROPERTY_PARAM]);
			});
			return ARRAY_PARAM;
		},
	};
	return object;
}

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
			case 'Update employee manager':
				updateEmployeeManager();
				break;
			case 'Remove employee':
				removeEmployee();
				break;
			case 'Remove role':
				removeRole();
				break;
			case 'Remove department':
				removeDepartment();
				break;
			case 'See total cost per department':
				checkBudget();
				break;
			case 'Exit':
				console.log(messages.exitMessage);
				connection.end();
				break;
		}
	});
}

function addDepartmentPrompts() {
	inquirer.prompt(questions.addDepartmentQuestions).then((res) => {
		connection.query(
			queries.insertDepartmentQuery,
			{
				name: res.departmentName,
			},
			(err) => {
				if (err) throw err;
				console.log(
					messages.notificationMessage(CREATED, DEPARTMENT, res.departmentName)
				);
				homePage();
			}
		);
	});
}
function addRolePrompts() {
	connection.query(queries.showAllDepartmentsQuery, (err, results) => {
		inquirer
			.prompt([
				...questions.addRoleQuestions,
				createListQuestion(
					DEPARTMENT,
					UPDATE_ROLE,
					'roleDepartmentName',
					'department',
					results,
					[]
				),
			])
			.then((res) => {
				const chosenDepartmentID = results.filter(
					(object) => object.department === res.roleDepartmentName
				)[0];
				connection.query(
					queries.insertRoleQuery,
					{
						title: res.roleName,
						salary: res.roleSalary,
						department_id: chosenDepartmentID.id,
					},
					(err) => {
						if (err) throw err;
						console.log(messages.notificationMessage(CREATED, ROLE, res.roleName));
						homePage();
					}
				);
			});
	});
}
function addEmployeePrompts() {
	connection.query(queries.showAllRolesQuery, (err, results) => {
		connection.query(queries.showAllEmployeeNamesQuery, (err, data) => {
			inquirer
				.prompt([
					...questions.addEmployeeQuestions,
					createListQuestion(ROLE, GIVE, 'employeeRole', 'role', results, []),
					createListQuestion(MANAGER, GIVE, 'employeeManager', 'manager', data, [
						'No Manager',
					]),
				])
				.then((res) => {
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
					connection.query(
						queries.insertEmployeeQuery,
						{
							first_name: res.employeeFirstName,
							last_name: res.employeeLastName,
							role_id: chosenRole.id,
							manager_id: chosenManager.id,
						},
						(err) => {
							if (err) throw err;
							const fullName = `${res.employeeFirstName + ' ' + res.employeeLastName}`;
							console.log(messages.notificationMessage(CREATED, EMPLOYEE, fullName));
							homePage();
						}
					);
				});
		});
	});
}

function viewingConnectionQuery(query) {
	connection.query(query, (err, results) => {
		console.table(results);
		homePage();
	});
}
function viewDepartments() {
	viewingConnectionQuery(queries.showAllDepartmentsQuery);
}
function viewRoles() {
	viewingConnectionQuery(queries.viewRolesFullQuery);
}
function viewAllEmployees() {
	viewingConnectionQuery(queries.viewEmployeesFullQuery);
}
function viewEmployeesByManager() {
	connection.query(queries.viewAllManagersQuery, (err, results) => {
		inquirer
			.prompt([
				createListQuestion(
					MANAGER,
					VIEW_EMPLOYEES,
					'managerOfEmployees',
					'manager',
					results,
					[]
				),
			])
			.then((res) => {
				const chosenManager = results.filter(
					(object) => object.manager === res.managerOfEmployees
				)[0];
				connection.query(
					`${queries.viewEmployeesByManagerQuery}` +
						` WHERE employee.manager_id = ${chosenManager.manager_id}`,
					(err, results) => {
						console.table(results);
						homePage();
					}
				);
			});
	});
}
function updateEmployeeRole() {
	connection.query(queries.getEmployeeFullNameQuery, (err, results) => {
		connection.query(queries.showAllRolesQuery, (err, data) => {
			inquirer
				.prompt([
					createListQuestion(
						EMPLOYEE,
						UPDATE_ROLE,
						'employeeToUpdate',
						'full_name',
						results,
						[]
					),
					createListQuestion(ROLE, GIVE, 'roleToGive', 'role', data, []),
				])
				.then((res) => {
					const newRole = data.filter((object) => object.role === res.roleToGive)[0];
					const chosenEmployee = results.filter(
						(object) => object.full_name === res.employeeToUpdate
					)[0];

					connection.query(
						queries.updateEmployeeQuery,
						[
							{
								role_id: newRole.id,
							},
							{
								id: chosenEmployee.id,
							},
						],
						(err) => {
							if (err) throw err;
							console.log(
								messages.notificationTwoVariable(
									UPDATED,
									res.employeeToUpdate,
									ROLE,
									res.roleToGive
								)
							);
							homePage();
						}
					);
				});
		});
	});
}
function updateEmployeeManager() {
	connection.query(queries.getEmployeeFullNameQuery, (err, results) => {
		connection.query(queries.getEmployeeFullNameQuery, (err, data) => {
			inquirer
				.prompt([
					createListQuestion(
						EMPLOYEE,
						UPDATE_MANAGER,
						'employeeToUpdate',
						'full_name',
						results,
						[]
					),
					createListQuestion(MANAGER, GIVE, 'newManager', 'full_name', data, []),
				])
				.then((res) => {
					const newManager = data.filter(
						(object) => object.full_name === res.newManager
					)[0];
					const chosenEmployee = results.filter(
						(object) => object.full_name === res.employeeToUpdate
					)[0];

					connection.query(
						queries.updateEmployeeQuery,
						[
							{
								manager_id: newManager.id,
							},
							{
								id: chosenEmployee.id,
							},
						],
						(err) => {
							if (err) throw err;
							console.log(
								messages.notificationTwoVariable(
									UPDATED,
									res.employeeToUpdate,
									MANAGER,
									res.newManager
								)
							);
							homePage();
						}
					);
				});
		});
	});
}

function removeConnectionQuery(
	QUERY_PARAM,
	ITEM_TYPE_PARAM,
	NAME_PARAM,
	PROPERTY_PARAM,
	QUERY_PARAM_2,
	ARRAY_PARAM
) {
	connection.query(QUERY_PARAM, (err, results) => {
		inquirer
			.prompt([
				createListQuestion(
					ITEM_TYPE_PARAM,
					DELETE,
					NAME_PARAM,
					PROPERTY_PARAM,
					results,
					ARRAY_PARAM
				),
			])
			.then((res) => {
				const chosenItem = results.filter(
					(object) => object[PROPERTY_PARAM] === res[NAME_PARAM]
				)[0];
				connection.query(
					QUERY_PARAM_2,
					{
						id: chosenItem.id,
					},
					(err) => {
						if (err) throw err;
						console.log(
							messages.notificationMessage(DELETED, ITEM_TYPE_PARAM, res[NAME_PARAM])
						);
						homePage();
					}
				);
			});
	});
}

function removeEmployee() {
	removeConnectionQuery(
		queries.getEmployeeFullNameQuery,
		EMPLOYEE,
		'employeeToRemove',
		'full_name',
		queries.deleteEmployeeQuery,
		[]
	);
}

function removeDepartment() {
	removeConnectionQuery(
		queries.showAllDepartmentsQuery,
		DEPARTMENT,
		'departmentToRemove',
		'department',
		queries.deleteDepartmentQuery,
		[]
	);
}
function removeRole() {
	removeConnectionQuery(
		queries.showAllRolesQuery,
		ROLE,
		'roleToRemove',
		'role',
		queries.deleteRoleQuery,
		[]
	);
}

function checkBudget() {
	connection.query(queries.checkBudgetQuery, (err, data) => {
		if (err) throw err;
		console.table(data);
		homePage();
	});
}

connection.connect((err) => {
	if (err) throw err;
	homePage();
});
