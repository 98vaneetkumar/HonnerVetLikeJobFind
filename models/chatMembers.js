//let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"chat_members", 
		{
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			groupId: {
				type: Sequelize.UUID,
				defaultValue: null
			},
			groupName: {
				type: DataTypes.TEXT,
				defaultValue: null,
			},
			chatId: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			senderId: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			receiverId: {
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
		{ tableName: "chat_members" }
	);
};
