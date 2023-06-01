module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_titles", {
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
		tableName: "job_titles"
	});
};
