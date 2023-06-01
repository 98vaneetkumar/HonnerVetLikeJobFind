module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("billing_address", {
		...require("./core")(Sequelize, DataTypes),
		firstName: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		lastName: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		phoneNumber: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		companyName: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		countryCode: {
			type: DataTypes.STRING(7),
			defaultValue: null,
		},
		address: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		state: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		city: {
			type: DataTypes.STRING(30),
			defaultValue: null,
		},
		countryName: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		zipCode: {
			type: DataTypes.STRING(30),
			defaultValue: null,
		},
		recruiterId: {
			type: Sequelize.UUID,
			defaultValue: null,
			references: {
				model: "recruiter", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
	}, {
		tableName: "billing_address"
	});
};
