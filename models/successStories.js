module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("success_stories", {
		...require("./core")(Sequelize, DataTypes),
		uploadImage: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		name: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		designation: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		companyName: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
	}, { tableName: "success_stories" }
	);
};
