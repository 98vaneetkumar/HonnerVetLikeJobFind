module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("categories", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		}
	}, {
		tableName: "categories"
	});
};
