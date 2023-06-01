module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("notifications", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		recruiterId:{
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		jobId:{
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		title: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		message : {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		userType: {
			type: DataTypes.TINYINT(1), //  0 for choose by user, 1 for ios, 2 for android, 3 for web, 4 for recruiter,5 for subAdmin, 6 for all user, 
			defaultValue: 0,
		},
		isRead: {
			type: DataTypes.TINYINT(1),  
			defaultValue: 0,
		},
		notificationType: {
			type: DataTypes.STRING(155),  
			defaultValue: 0,
		},
	}, {
		tableName: "notifications"
	});
};
