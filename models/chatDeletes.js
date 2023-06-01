//let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"chat_deletes", 
		{
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			chatId: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			userId: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			chatDialogId: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			messageId: {
				type: DataTypes.STRING(150),
				defaultValue: null,
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW(0),
				field: "createdAt"
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW(0),
				field: "updatedAt"
			},
		}, 
		{ tableName: "chat_deletes" }
	);
};
