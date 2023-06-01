module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("group_permissions", {
		...require("./core")(Sequelize, DataTypes),
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
		groupName: {
			type: DataTypes.STRING(30),
			allowNull: true
		},
		groupDescription: {
			type: DataTypes.STRING(250),
			allowNull: true
		},
		createJob: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		viewTeamMemberJob: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		editTeamMemberJob: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		addTeamMember: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		editTeamMember: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		deleteTeamMember: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		viewActivePlans: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		buyInventory: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		viewInvoice: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		cancelSubscription: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		dashboard: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		jobPost: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		search: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		user: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		groupAndPermission: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		messages: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		reports: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
		myCandidate: {
			type: DataTypes.TINYINT(1),
			allowNull: false,
			defaultValue: 0,
		},
	}, {
		tableName: "group_permissions"
	});
};
