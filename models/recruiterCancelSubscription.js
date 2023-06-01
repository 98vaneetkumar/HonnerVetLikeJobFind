module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_cancel_subscription", {
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
		stripSubscriptionId: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		stripSubscriptionData: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		stripeBodyInvoice: {
			type: DataTypes.TEXT,
			defaultValue: null,
		}
	}, { tableName: "recruiter_cancel_subscription" }
	);
};
