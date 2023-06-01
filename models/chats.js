//let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"chats", 
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
			senderId: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			receiverId: {
				type: DataTypes.TEXT(),
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
			message: {
				type: DataTypes.TEXT(),
				defaultValue: null,
			},
			messageStatus: {
				type: DataTypes.STRING(6),
				defaultValue: null,
			},
			messageType: {
				type: DataTypes.TINYINT(1),
				defaultValue: 0
			},
			firebaseMessageTime: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			messageTime: {
				type: DataTypes.STRING(255),
				defaultValue: null,
			},
			attachmentUrl: {
				type: DataTypes.STRING(200),
				defaultValue: null,
			},
			reply_msg: {
				type: DataTypes.TEXT(),
				defaultValue: null,
			},
			reply_id: {
				type: DataTypes.TEXT(),
				defaultValue: null,
			},
			is_delete: {
				type: DataTypes.TEXT(),
				defaultValue: null,
			},
			is_star: {
				type: DataTypes.TEXT(),
				defaultValue: null,
			},
			reply_type: {
				type: DataTypes.INTEGER,
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
		{ tableName: "chats" }
	);
};