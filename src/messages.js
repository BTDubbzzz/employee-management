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
