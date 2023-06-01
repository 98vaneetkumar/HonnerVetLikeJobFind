module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_tour_of_duties", {
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
		}
	}, {
		tableName: "user_tour_of_duties"
	});
};
