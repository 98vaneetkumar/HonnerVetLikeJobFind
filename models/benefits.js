module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("benefits", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		isOrderBy: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		}
	}, {
		tableName: "benefits"
	});
};
