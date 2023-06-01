module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_resume_status", {
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
		isUploadDoucment: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isCreateProfile: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isUploadResume: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isSkills: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isEducation: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isWorkExperiences: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isVolunteerExperiences: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isProjectUnderTaken: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isAwardHonors: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isCertification: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isLanguages: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isPreferences: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		isSteped: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	}, {
		tableName: "user_resume_status"
	});
};
