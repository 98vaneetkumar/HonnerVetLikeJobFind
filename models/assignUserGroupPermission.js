module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("assign_user_group", {
		...require("./core")(Sequelize, DataTypes),
		groupPermissionId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "group_permissions"
			},
			type: Sequelize.UUID		
		},
		recruiterUserId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter_users"
			},
			type: Sequelize.UUID
		},
		select: {
			type: DataTypes.TINYINT(1),  // 0 for Select and 1 for unSelect
			defaultValue: 0
		},
	}, {
		tableName: "assign_user_group"
	});
};
