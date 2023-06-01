module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_search_key", {
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
		},
		title:{
			type: DataTypes.STRING(100),
			defaultValue: null,
		}
	}, {
		tableName: "recruiter_search_key"
	});
};
