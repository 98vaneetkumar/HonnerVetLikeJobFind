module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_job_apply", {
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
		status:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   // 0 for pending 1 for shortlisted 2 for rejected and 3 for on hold
		},
		note:{
			type:DataTypes.STRING,
			defaultValue:null
		},
		flag:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0    
			// 0  for those user whom can apply job itself and 1 for those that move by recruiter from suggested candidate
		}
	}, {
		tableName: "user_job_apply"
	});
};
