const { createConnection } = require('mysql');

const homePageQuestions = [
	{
		message: 'What would you like to do?',
		type: 'list',
		name: 'homeChoice',
		choices: [
			'Add department',
			'Add role',
			'Add employee',
			'View departments',
			'View roles',
			'View all employees',
			'View all employees by manager',
			'Update employee roles',
			'Remove employee',
			'Exit',
		],
	},
];

const addDepartmentQuestions = [
	{
		message: 'Please enter the name of the department',
		type: 'input',
		name: 'departmentName',
	},
];
const addRoleQuestions = [
	{
		message: 'Please enter name of new role',
		type: 'input',
		name: 'roleName',
	},
	{
		message: 'Please enter salary of this role',
		type: 'input',
		name: 'roleSalary',
	},
	{
		message: 'Please choose the department for this role',
		type: 'list',
		name: 'roleDepartmentID',
		choices: ['get list of departments'],
	},
];
const addEmployeeQuestions = [
	{
		message: 'Please enter the first name of the employee',
		type: 'input',
		name: 'employeeFirstName',
	},
	{
		message: 'Please enter the last name of the employee',
		type: 'input',
		name: 'employeeLastName',
	},
	{
		message: 'Please choose employee role',
		type: 'list',
		name: 'employeeRole',
		choices: ['get list of roles'],
	},
	{
		message: "Please choose the employee's manager",
		type: 'list',
		name: 'employeeManager',
		choices: ['get list of managers'],
	},
];

const employeesByManager = [
	{
		message: 'Choose the Manager to see their employees',
		type: 'list',
		name: 'managerOfEmployees',
		choices() {
			connection.query(
				`SELECT 
				CONCAT(manager.first_name,' ', manager.last_name) AS manager
				FROM employee
				LEFT JOIN employee AS manager
				ON employee.manager_id = manager.id
				WHERE employee.manager_id IS NOT NULL`,
				(err, results) => {
					const choiceArray = [];
					results.forEach((element) => {
						choiceArray.push(element.manager);
					});
					return choiceArray;
				}
			);
		},
	},
];

const updateRoleQuestions = [
	{
		message: 'Please choose the employee to update their role',
		type: 'list',
		name: 'employeeToUpdate',
		choices: ['get list of employees'],
	},
];

const removeEmployeeQuestions = [
	{
		message: 'Please choose the employee to remove',
		type: 'list',
		name: 'employeeToRemove',
		choices: ['get list of employees'],
	},
];

module.exports = {
	homePageQuestions,
	addDepartmentQuestions,
	addRoleQuestions,
	addEmployeeQuestions,
	employeesByManager,
	updateRoleQuestions,
	removeEmployeeQuestions,
};
