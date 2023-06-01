module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_job_post_save", {
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
		}
	}, {
		tableName: "user_job_post_save"
	});
};
