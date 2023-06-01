module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_turn_off_notification", {
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
		recruiterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter"
			},
			type: Sequelize.UUID
		},
	}, {
		tableName: "user_turn_off_notification"
	});
};
