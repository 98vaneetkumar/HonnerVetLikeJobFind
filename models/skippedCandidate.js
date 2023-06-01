module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("skipped_candidate", {
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
		recuriterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter"
			},
			type: Sequelize.UUID
		}
	}, {
		tableName: "skipped_candidate"
	});
};
