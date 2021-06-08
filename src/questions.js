const homePageQuestions = [
	{
		message: `
		
What would you like to do?		

`,
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
			'Update employee manager',
			'Remove employee',
			'Remove role',
			'Remove department',
			'See total cost per department',
			'Exit',
		],
	},
];

const addDepartmentQuestions = [
	{
		message: `
		
Please enter the name of the department: `,
		type: 'input',
		name: 'departmentName',
	},
];
const addRoleQuestions = [
	{
		message: `
		
Please enter name of new role: `,
		type: 'input',
		name: 'roleName',
	},
	{
		message: `
		
Please enter salary of this role: `,
		type: 'input',
		name: 'roleSalary',
		validate(value) {
			if (isNaN(value) === false) {
				return true;
			}
			console.log('Must input a Number!');
			return false;
		},
	},
];
const addEmployeeQuestions = [
	{
		message: `
		
Please enter the first name of the employee: `,
		type: 'input',
		name: 'employeeFirstName',
	},
	{
		message: `
		
Please enter the last name of the employee: `,
		type: 'input',
		name: 'employeeLastName',
	},
];

module.exports = {
	homePageQuestions,
	addDepartmentQuestions,
	addRoleQuestions,
	addEmployeeQuestions,
};
