module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"job_post_add_questions",
		{
			...require("./core")(Sequelize, DataTypes),
			addScreeningQuestionId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "screening_question",
				},
				type: Sequelize.UUID,
			},
			recuiterId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "recruiter",
				},
				type: Sequelize.UUID,
			},
			title: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			skillName: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			experience: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			responseType: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			answer: {
				type: DataTypes.STRING,
				defaultValue: null,
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
		},
		{
			tableName: "job_post_add_questions",
		}
	);
};
