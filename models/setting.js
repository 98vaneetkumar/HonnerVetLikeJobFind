
module.exports = function (Sequelize,sequelize, DataTypes) {
	return sequelize.define("setting", {
		...require("./core")(Sequelize, DataTypes),
		becameCreator: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		emailId: {
			allowNull: false,
			type: DataTypes.STRING(200)
		},
		phoneNo: {
			allowNull: false,
			type: DataTypes.STRING(200)
		},
		facebookId: {
			allowNull: false,
			type: DataTypes.STRING(200)
		},
		twitterId: {
			allowNull: false,
			type: DataTypes.STRING(200)
		},
		linkedinId: {
			allowNull: false,
			type: DataTypes.STRING(200)
		},
		videoPerViews: {
			type: DataTypes.INTEGER,
			defaultValue: "0",
		},
		isAdType: {
			type: DataTypes.TINYINT(1),
			defaultValue: "1", // 1 is Ads modes  2 is IronSource 3 is AppLove in
			field: "isAdType"
		},
		isAndroidAdType: {
			type: DataTypes.TINYINT(1),
			defaultValue: "1", // 1 is Ads mod 2 is IronSource 3 is AppLove in
			field: "isAndroidAdType"
		},
		status: {
			type: DataTypes.ENUM,
			values: ["0", "1"],
			defaultValue: "0",
		},
	},
	{ tableName: "setting" }
	);
};