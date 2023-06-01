module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_work_experiences", {
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
		fromDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		toDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		jobTitle: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		companyName: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		employementTypeId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "employement_types"
			},
			type: Sequelize.UUID
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		location: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},        
		zipCode: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		},
		latitude: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		longitude: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		underContractOf: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		isCurrentlyRole: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	}, {
		tableName: "user_work_experiences"
	});
};
