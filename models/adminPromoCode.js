module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("promo_code", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			defaultValue: null
		},
		code: {
			type: DataTypes.STRING(150),
			defaultValue: null
		},
		description: {
			type: DataTypes.STRING(250),
			defaultValue: null
		},
		startDate: {
			type: DataTypes.DATE,
			defaultValue: null
		},
		expiryDate: {
			type: DataTypes.DATE,
			defaultValue: null
		},
		discountPercentage: {
			type: DataTypes.FLOAT(20),
			defaultValue: null
		},
		promoType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for Subscription Promo Plans and 1 for Inventory Promo Plans
		},
	}, {
		tableName: "promo_code"
	});
};
