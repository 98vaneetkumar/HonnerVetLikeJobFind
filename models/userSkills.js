module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_skills", {
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
		skillId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "skills"
			},
			type: Sequelize.UUID
		},
		otherTitle: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		}
	}, {
		tableName: "user_skills"
	});
};
