module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_project_documents", {
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
		projectId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "user_project_under_takens"
			},
			type: Sequelize.UUID
		},
	}, {
		tableName: "user_project_documents"
	});
};
