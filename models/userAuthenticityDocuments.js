module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_authenticity_documents", {
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
		link: {
			type: DataTypes.TEXT,
			defaultValue: null,
		}
	}, {
		tableName: "user_authenticity_documents"
	});
};
