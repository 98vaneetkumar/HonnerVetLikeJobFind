module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_volunteer_experiences", {
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
		organization: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		role: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		cause: {
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
		isCurrentlyRole: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	}, {
		tableName: "user_volunteer_experiences"
	});
};
