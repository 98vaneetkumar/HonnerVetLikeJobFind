module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("payment_plan", {
		...require("./core")(Sequelize, DataTypes),
		planName: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		planAmount: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		planTax: {
			type: DataTypes.FLOAT(20),
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
		stripProduct: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		stripData: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		validityType: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		planType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for Subscription Plans and 1 for Inventory Plans
		},
		jobType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 for concurrent Plans and 1 for non-Concurrent Plans
		}
	}, { tableName: "payment_plan" }
	);
};
