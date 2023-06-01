module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"recruiter_group_permissions",
		{
			...require("./core")(Sequelize, DataTypes),
			recruiterUserId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: {
					model: "recruiter_users", // name of Target model
					key: "id", // key in Target model that we"re referencing
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
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
			}
		},
		{
			tableName: "recruiter_group_permissions"
		});
};