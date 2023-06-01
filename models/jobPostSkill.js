module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_skills", {
		...require("./core")(Sequelize, DataTypes),
		skillId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "skills"
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
		tableName: "job_post_skills"
	});
};
