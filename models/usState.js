module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("us_state", {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		abbrev: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
	}, {
		tableName: "us_state"
	});
};
