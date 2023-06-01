module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_strip_customer", {
		...require("./core")(Sequelize, DataTypes),
		customerId: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		stripeBody: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		recruiterId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "recruiter", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		}
	}, {
		tableName: "recruiter_strip_customer"
	});
};
