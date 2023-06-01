module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("templates", {
		...require("./core")(Sequelize, DataTypes),
		recruiterId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "recruiter", // name of Target model
					key: "id", // key in Target model that we"re referencing
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
		},
		subject: {
			type: DataTypes.STRING(150),
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		action: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		}
	}, {
		tableName: "templates"
	});
};
