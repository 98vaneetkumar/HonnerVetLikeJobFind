module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_project_links", {
		...require("./core")(Sequelize, DataTypes),
		link: {
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
		tableName: "user_project_links"
	});
};
