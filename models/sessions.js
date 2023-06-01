module.exports = (Sequelize, sequelize, DataTypes) => {
	return sequelize.define("sessions", {
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
		deviceIdentifier: {
			allowNull: true,
			type: DataTypes.STRING(200)
		},
		deviceToken: {
			allowNull: true,
			type: DataTypes.STRING(255)
		},
		accessToken: {
			allowNull: true,
			type: DataTypes.TEXT
		},
		deviceType: {
			allowNull: true,
			type: DataTypes.STRING(200)
		}
	}, { tableName: "sessions" }
	);
};
