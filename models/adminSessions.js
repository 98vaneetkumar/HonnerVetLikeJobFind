module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("admin_sessions", {
		...require("./core")(Sequelize, DataTypes),
		adminId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "admin"
			},
			type: Sequelize.UUID
		},
		accessToken: {
			allowNull: true,
			type: DataTypes.TEXT
		},
		adminRoleId: {
			type: Sequelize.UUID,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			defaultValue: null
		},
		deviceToken: {
			allowNull: true,
			type: DataTypes.STRING(255)
		}
	}, { tableName: "admin_sessions" });
};