module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_project_under_takens", {
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
		fromDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		toDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		projectTitle: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		associatedWith: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		jobTitle: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		employementTypeId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "employement_types"
			},
			type: Sequelize.UUID
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
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
		isCurrentlyOngoing: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	}, {
		tableName: "user_project_under_takens"
	});
};
