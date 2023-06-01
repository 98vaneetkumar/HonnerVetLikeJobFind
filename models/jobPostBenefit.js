module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_benefits", {
		...require("./core")(Sequelize, DataTypes),
		benefitsId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "benefits"
			},
			type: Sequelize.UUID		},
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
		tableName: "job_post_benefits"
	});
};
