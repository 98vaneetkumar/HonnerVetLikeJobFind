module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_search_appearance", {
		...require("./core")(Sequelize, DataTypes),
		recuiterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter",
			},
			defaultValue: null,
			type: Sequelize.UUID,
		},
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		}
	}, {
		tableName: "recruiter_search_appearance"
	});
};
