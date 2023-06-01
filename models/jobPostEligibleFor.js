module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_eligible_for", {
		...require("./core")(Sequelize, DataTypes),
		jobEligibleForId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "eligibles"
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
		tableName: "job_post_eligible_for"
	});
};
