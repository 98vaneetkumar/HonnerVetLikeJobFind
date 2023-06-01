module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_langauges", {
		...require("./core")(Sequelize, DataTypes),
		language: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		proficiency: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		}
	}, {
		tableName: "user_langauges"
	});
};
