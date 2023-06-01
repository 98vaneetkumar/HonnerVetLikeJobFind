//let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"clear_chat", 
		{
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.TEXT(),
				defaultValue: null,
			},
			chatClearDate: {
				type: DataTypes.DATE,
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
		{ tableName: "clear_chat" }
	);
};