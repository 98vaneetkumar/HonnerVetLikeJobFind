module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("jobs", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.TEXT,
			defaultValue: 0
		},
		isOrderBy: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		}
	}, {
		tableName: "jobs"
	});
};
