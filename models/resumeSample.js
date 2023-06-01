module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("resume_sample", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		images: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		templateId: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	}, {
		tableName: "resume_sample"
	});
};
