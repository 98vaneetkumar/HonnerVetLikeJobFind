module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_sessions", {
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
		accessToken: {
			allowNull: true,
			type: DataTypes.TEXT
		},
		deviceToken: {
			allowNull: true,
			type: DataTypes.STRING(255)
		}
	}, { tableName: "recruiter_sessions" });
};