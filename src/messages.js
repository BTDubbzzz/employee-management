const { homePageQuestions } = require('./questions');

const message1 = `asdfasdf`;

const notificationMessage = (typeOfOperation, typeOfItem, variable) => {
	return `

------------------------------------------------------------------    
You have successfully ${typeOfOperation} ${typeOfItem} ${variable}
------------------------------------------------------------------

`;
};

const notificationTwoVariable = (
	typeOfOperation,
	typeOfItem,
	variable1,
	variable2
) => {
	return `

------------------------------------------------------------------    
You have successfully ${typeOfOperation} ${variable1}'s ${typeOfItem} to ${variable2}
------------------------------------------------------------------
    
`;
};

const listMessage = (itemToChoose, actionToTake) => {
	return `
					
Please choose the ${itemToChoose} to ${actionToTake}
    
`;
};

const exitMessage = `
				
-----------------------------------
Exiting program, goodbye!
------------------------------------

`;

module.exports = {
	message1,
	notificationMessage,
	notificationTwoVariable,
	listMessage,
	exitMessage,
};

function removeConnectionQuery(QUERY_PARAM, ITEM_TYPE_PARAM, NAME_PARAM) {
	connection.query(QUERY_PARAM, (err, results) => {
		inquirer
			.prompt([
				{
					message: messages.listMessage(ITEM_TYPE_PARAM, DELETE),
					type: 'list',
					name: NAME_PARAM,
					choices() {
						const choiceArray = [];
						results.forEach((element) => {
							choiceArray.push(element[PROPERTY_PARAM]);
						});
						return choiceArray;
					},
				},
			])
			.then((res) => {
				const chosenItem = results.filter(
					(object) => PROPERTY_PARAM === res.NAME_PARAM
				)[0];
				connection.query(
					QUERY_PARAM_2,
					{
						id: chosenItem.id,
					},
					(err) => {
						if (err) throw err;
						console.log(
							messages.notificationMessage(DELETED, ITEM_TYPE_PARAM, res.NAME_PARAM)
						);
						homePage();
					}
				);
			});
	});
}

// removeConnectionQuery();
