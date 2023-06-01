module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("eligibles", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		}
	}, {
		tableName: "eligibles"
	});
};
