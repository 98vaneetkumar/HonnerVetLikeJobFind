module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_profile_action", {
		...require("./core")(Sequelize, DataTypes),
		recuiterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter",
			},
			defaultValue: null,
			type: Sequelize.UUID,
		},
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		actionType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 
		}
	}, {
		tableName: "recruiter_profile_action"
	});
};
