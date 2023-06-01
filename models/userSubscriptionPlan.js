module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_subscription_plan", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		paymentPlanId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "payment_plan"
			},
			type: Sequelize.UUID
		},
		planName: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		planAmount: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		numberOfJob: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		numberOfView: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		numberOfClicks: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		expiryMonth: {
			type: DataTypes.STRING(10),
			defaultValue: null,
			field: "expiryMonth"
		},
		expiryYear: {
			type: DataTypes.STRING(10),
			defaultValue: null,
			field: "expiryYear"
		},
		planType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for Subscription Plans and 1 for Inventory Plans
		}
	}, {
		tableName: "user_subscription_plan"
	});
};
