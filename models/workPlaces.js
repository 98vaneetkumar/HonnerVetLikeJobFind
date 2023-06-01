module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("work_places", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		}
	}, {
		tableName: "work_places"
	});
};
