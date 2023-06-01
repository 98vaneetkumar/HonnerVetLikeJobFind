module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_awards_and_honors", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		associatedWith: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		issuer : {
			type: DataTypes.TEXT,
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
		},
		issuesedOn: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		orderByIndex: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		isType: {
			type: DataTypes.TINYINT(1), // 0 is user profile honors award
			defaultValue: 0
		},
	}, {
		tableName: "user_awards_and_honors"
	});
};
