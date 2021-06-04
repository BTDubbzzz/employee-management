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
				break;
		}
	});
}

function addDepartmentPrompts() {
	console.log('add d');
	inquirer
		.prompt(questions.addDepartmentQuestions)
		.then((res) => console.log('res :>> ', res))
		.then(function () {
			homePage();
		});
}
function addRolePrompts() {
	console.log('add r');
	inquirer
		.prompt(questions.addRoleQuestions)
		.then((res) => console.log('res :>> ', res))
		.then(function () {
			homePage();
		});
}
function addEmployeePrompts() {
	console.log('add e');
	inquirer
		.prompt(questions.addEmployeeQuestions)
		.then((res) => console.log('res :>> ', res))
		.then(function () {
			homePage();
		});
}
function viewDepartments() {
	console.log('v d');
}
function viewRoles() {
	console.log('v r');
}
function viewAllEmployees() {
	console.log('v e');
}
function viewEmployeesByManager() {
	console.log('v e b m');
	inquirer
		.prompt(questions.employeesByManager)
		.then((res) => console.log('res :>> ', res))
		.then(function () {
			homePage();
		});
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

homePage();
