
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("notification_messages", {
		...require("./core")(Sequelize, DataTypes),
		title: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		startDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		message : {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		schedule : {
			type: DataTypes.STRING(200),
			defaultValue: null,
		},
		userType: {
			type: DataTypes.TINYINT(1), //  0 for choose by user, 1 for ios, 2 for android, 3 for web, 4 for recruiter,5 for subAdmin, 6 for all user, 
			defaultValue: 0,
		},
		notificationStatus: {
			type: DataTypes.TINYINT(1), //  0 = Send Now , 1 = Send Later, 2 = Save AS Draft 
			defaultValue: 0,
		},
	}, {
		tableName: "notification_messages"
	});
};
