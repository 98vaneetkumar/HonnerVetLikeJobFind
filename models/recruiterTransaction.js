module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_transaction", {
		...require("./core")(Sequelize, DataTypes),
		recruiterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter"
			},
			type: Sequelize.UUID
		},
		planId: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		planName: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		planAmount: {
			type: DataTypes.INTEGER,
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
		concurrentJobsAssignedEachPlan: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		nonConcurrentJobsAssignedEachPlan: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		validity: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		duration: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		numberOfClicks: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		stripSubscriptionId: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		stripSubscriptionData: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		validityType: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		promoCodeId: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		promoCode: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		discount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		planType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for Subscription Plans and 1 for Inventory Plans
		},
		status:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for pending 1 is success 2 failed
		},
		isSubscription:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for pending 1 is active  2 cancel
		}
	}, { tableName: "recruiter_transaction" }
	);
};
