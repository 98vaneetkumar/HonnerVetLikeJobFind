module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("personalities", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		}
	}, {
		tableName: "personalities"
	});
};
