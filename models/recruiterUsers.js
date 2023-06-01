module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_users", {
		...require("./core")(Sequelize, DataTypes),
		fullName: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		phoneNumber: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		title: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		isArchive: {
			type: DataTypes.TINYINT(1),  // 0 for Users and 1 for Archive Users
			defaultValue: 0
		},
		lastActivity: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(0),
			field: "lastActivity",
		},
		linkedin: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		recruiterId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "recruiter", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
	}, {
		tableName: "recruiter_users"
	});
};
