module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_documents", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		fileName: {
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
		},
		documentTyped: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		}
	}, {
		tableName: "user_documents"
	});
};
