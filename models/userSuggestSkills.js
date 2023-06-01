module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_suggest_skills", {
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
		suggestSkillId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "suggest_skills"
			},
			type: Sequelize.UUID
		}
	}, {
		tableName: "user_suggest_skills"
	});
};
