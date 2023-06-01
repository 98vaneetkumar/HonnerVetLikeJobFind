module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("sub_categories", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		categoryId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "categories"
			},
			type: Sequelize.UUID
		}
	}, {
		tableName: "sub_categories"
	});
};
