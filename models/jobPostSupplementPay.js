module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_supplement_pay", {
		...require("./core")(Sequelize, DataTypes),
		supplementalPayId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "supplements"
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
		tableName: "job_post_supplement_pay"
	});
};
