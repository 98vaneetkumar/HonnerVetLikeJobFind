module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_job_preferences_job_titles", {
		...require("./core")(Sequelize, DataTypes),
		jobTitleId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "job_titles"
			},
			type: Sequelize.UUID
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
		jobPreferenceId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "user_job_preferences"
			},
			type: Sequelize.UUID
		},
		otherTitle: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		}
	}
	, {
		tableName: "user_job_preferences_job_titles"
	});
};
