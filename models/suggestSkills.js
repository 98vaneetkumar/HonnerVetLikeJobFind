module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("suggest_skills", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		}
	}, {
		tableName: "suggest_skills"
	});
};
