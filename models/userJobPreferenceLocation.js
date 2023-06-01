module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_job_preferences_locations", {
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
		jobPreferenceId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "user_job_preferences"
			},
			type: Sequelize.UUID
		},
		location: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},        
		zipCode: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		},
		latitude: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		longitude: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
	}
	, {
		tableName: "user_job_preferences_locations"
	});
};
