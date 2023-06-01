module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("favouriter_candidate", {
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
		},
		jobPostId:{
			type: DataTypes.STRING
		},
		favourite:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   // 0 for not favourite and 1 for favourite
		}
	}, {
		tableName: "favouriter_candidate"
	});
};
