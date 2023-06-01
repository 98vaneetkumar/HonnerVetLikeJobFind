module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"user_job_notes",
		{
			...require("./core")(Sequelize, DataTypes),
			userId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "users",
				},
				type: Sequelize.UUID,
			},
			jobPostId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "job_posts",
				},
				type: Sequelize.UUID,
			},
			status: {
				type: DataTypes.TINYINT(1),
				defaultValue: 0, // 0 for pending 1 for shortlisted 2 for rejected and 3 for on hold
			},
			note: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			recruiterId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "recruiter",
				},
				type: Sequelize.UUID,
			},
			subRecruiterId: {
				type: DataTypes.STRING,
				defaultValue: null,
			}
		},
		{
			tableName: "user_job_notes",
		}
	);
};
