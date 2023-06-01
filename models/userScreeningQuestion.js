module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_screening_question", {
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
		jobApplyId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "user_job_apply"
			},
			type: Sequelize.UUID
		},
		jobPostAddQuestionId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "job_post_add_questions",
			},
			type: Sequelize.UUID,
		},
		title: {
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
	}, {
		tableName: "user_screening_question"
	});
};
