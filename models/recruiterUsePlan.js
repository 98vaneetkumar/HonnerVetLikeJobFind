module.exports=function(Sequelize,sequelize,DataTypes){
	return sequelize.define("recruiter_use_plan",{
		...require("./core")(Sequelize,DataTypes),
		companyId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter"
			},
			type: Sequelize.UUID
		},
		subRecruiterId:{
			type:DataTypes.STRING(100),
			defaultValue:null
		},
		jobId:{
			type:DataTypes.STRING(100),
			defaultValue:null
		},
		planId:{
			type:DataTypes.STRING(100),
			defaultValue:null
		},
		isType:{
			type:DataTypes.TINYINT(1),
			defaultValue:0   // 0 is company 1-is sub-recruiter
		}

	} ,{
		tableName: "recruiter_use_plan"
	});
};