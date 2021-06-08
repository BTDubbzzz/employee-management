const insertDepartmentQuery = `INSERT INTO department SET ?`;

const showAllDepartmentsQuery = 'SELECT id, name AS department FROM department';

const insertRoleQuery = `INSERT INTO role SET ?`;

const showAllRolesQuery = `
SELECT
id,
title AS role
FROM role`;

const showAllEmployeeNamesQuery = `SELECT
id,
CONCAT(first_name,' ', last_name) AS manager
FROM employee`;

const insertEmployeeQuery = `INSERT INTO employee SET ?`;

const viewRolesFullQuery = `SELECT 
role.id, 
role.title AS role, 
role.salary,
department.name AS department
FROM role
JOIN department
ON role.department_id = department.id`;

const viewEmployeesFullQuery = `SELECT 
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
ON employee.manager_id = manager.id`;

const viewAllManagersQuery = `SELECT DISTINCT
employee.manager_id,
CONCAT(manager.first_name,' ', manager.last_name) AS manager
FROM employee
JOIN employee AS manager
ON employee.manager_id = manager.id
WHERE employee.manager_id IS NOT NULL`;

const viewEmployeesByManagerQuery = `SELECT 
employee.first_name,
employee.last_name,
role.title AS role,
CONCAT(manager.first_name,
' ',
manager.last_name) AS manager
FROM
employee
LEFT JOIN
employee AS manager ON employee.manager_id = manager.id
JOIN
role ON role.id = employee.role_id`;

const getEmployeeFullNameQuery = `SELECT
employee.id,
CONCAT(employee.first_name,' ', employee.last_name) AS full_name
FROM employee`;

const updateEmployeeQuery = `UPDATE employee SET ? WHERE ?`;

const deleteEmployeeQuery = `DELETE FROM employee WHERE ?`;

const deleteDepartmentQuery = `DELETE FROM department WHERE ?`;

const deleteRoleQuery = `DELETE FROM role WHERE ?`;

const checkBudgetQuery = `SELECT 
department.name AS department, 
SUM(role.salary) as total_cost
FROM employee 
JOIN role 
ON employee.role_id = role.id 
JOIN department 
ON role.department_id = department.id
GROUP BY department_id
`;

module.exports = {
	insertDepartmentQuery,
	showAllDepartmentsQuery,
	insertRoleQuery,
	showAllRolesQuery,
	showAllEmployeeNamesQuery,
	insertEmployeeQuery,
	viewRolesFullQuery,
	viewEmployeesFullQuery,
	viewAllManagersQuery,
	viewEmployeesByManagerQuery,
	getEmployeeFullNameQuery,
	updateEmployeeQuery,
	deleteEmployeeQuery,
	deleteDepartmentQuery,
	deleteRoleQuery,
	checkBudgetQuery,
};

function createListQuestion(
	LIST_PARAM_1,
	LIST_PARAM_2,
	NAME_PARAM,
	PROPERTY_PARAM,
	results
) {
	const object = {
		message: messages.listMessage(LIST_PARAM_1, LIST_PARAM_2),
		type: 'list',
		name: NAME_PARAM,
		choices() {
			const choiceArray = [];
			results.forEach((element) => {
				choiceArray.push(element[PROPERTY_PARAM]);
			});
			return choiceArray;
		},
	};
	return object;
}
