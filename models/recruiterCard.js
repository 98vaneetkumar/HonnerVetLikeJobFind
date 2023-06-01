module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_card", {
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
		stripeCardToken: {
			defaultValue: null,
			field: "stripeCardToken",
			type: DataTypes.STRING(200)
		},
		stripeCardId: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "stripeCardId"
		},
		stripeSourceId: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "stripeSourceId"
		},
		expYear: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "expYear"
		},
		expMonth: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "expMonth"
		},
		last4: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "last4"
		},
		cardHolderName: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: "cardHolderName"
		},
		customerId: {
			type: DataTypes.STRING(100),
			defaultValue: null,
			field: "customerId"
		},
		stripeSourceBody: {
			type: DataTypes.TEXT,
			defaultValue: null,
			field: "stripeSourceBody"
		},
		stripeBody: {
			type: DataTypes.TEXT,
			defaultValue: null,
			field: "stripeBody"
		},
		isSaved: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isPrimary: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	}, {
		tableName: "recruiter_card"
	});
};
