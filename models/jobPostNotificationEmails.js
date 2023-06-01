module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_notification_emails", {
		...require("./core")(Sequelize, DataTypes),
		emailId: {
			type: DataTypes.STRING(255),
			defaultValue: 0
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
		tableName: "job_post_notification_emails"
	});
};
