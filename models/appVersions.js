module.exports = function (Sequelize, sequelize, DataTypes) {
	let core = require("./core")(Sequelize, DataTypes);
	//Please follow same naming convention for table name as its there in this file
	return sequelize.define("app_version", {
		...core,
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		app: {
			type: DataTypes.TINYINT,
			allowNull: false,
		},
		version: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		minimumVersion: {
			type: DataTypes.STRING(255),
			allowNull: false,
		}
	}, {
		tableName: "app_version"
	});
};
