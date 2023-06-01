module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_personalities", {
		...require("./core")(Sequelize, DataTypes),
		personalitiesId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "personalities"
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
		tableName: "job_post_personalities"
	});
};
