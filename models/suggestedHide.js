module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("suggested_hide", {
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
		jobPostId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "job_posts"
			},
			type: Sequelize.UUID
		},
		recruiterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter"
			},
			type: Sequelize.UUID
		},
		
	}, {
		tableName: "suggested_hide"
	});
};
