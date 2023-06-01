"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");
//With job post add question
Models.JobPosts.hasMany(Models.JobPostAddQuestions, {
	foreignKey: "jobPostId",
});
//With job post benefits
Models.JobPosts.hasMany(Models.JobPostBenefits, {
	foreignKey: "jobPostId",
});
//With job post notification emails
Models.JobPosts.hasMany(Models.JobPostNotificationEmails, {
	foreignKey: "jobPostId",
});
//With job post personalities
Models.JobPosts.hasMany(Models.JobPostPersonalities, {
	foreignKey: "jobPostId",
});
//With job post skills
Models.JobPosts.hasMany(Models.JobPostSkills, {
	foreignKey: "jobPostId",
});

//With  add question with question
Models.ScreeningQuestion.hasMany(Models.JobPostAddQuestions, {
	foreignKey: "addScreeningQuestionId",
});

//With  job post skills with skills
Models.Skills.hasMany(Models.JobPostSkills, {
	foreignKey: "skillId",
});

//With  job post personality with personality
Models.Personalities.hasMany(Models.JobPostPersonalities, {
	foreignKey: "personalitiesId",
});

//With  job post notificationEmail with user
// Models.Users.hasMany(Models.JobPostNotificationEmails, {
// 	foreignKey: "emailId",
// });
//With  job post Benefits with Benefits
Models.Benefits.hasMany(Models.JobPostBenefits, {
	foreignKey: "benefitsId",
});

//With  job post add question with Recruiter
Models.Recruiter.hasMany(Models.JobPostAddQuestions, {
	foreignKey: "recuiterId",
});
//With category table
//test
exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.JobPosts, objToSave);
};

//save bulk
exports.saveBulkCreate = async (Models, objToSave) => {
	return await baseService.saveBulkData(Models, objToSave);
};
//test
exports.updateData = async (criteria, objToSave) => {
	return await baseService.updateData(Models.JobPosts, criteria, objToSave);
};
//delete data
exports.deleteData = async (ModelsSend, criteria, objToSave) => {
	return await baseService.updateData(ModelsSend, criteria, objToSave);
};
exports.hardDelete = async (ModelsSend, criteria, objToSave) => {
	return await baseService.delete(ModelsSend, criteria, objToSave);
};
exports.BlockData = async (ModelsSend, criteria, objToSave) => {
	return await baseService.updateData(ModelsSend, criteria, objToSave);
};

exports.updateJobApplyStatus = async (criteria, objToSave) => {
	return await baseService.updateData(Models.UserJobApply, criteria, objToSave);
};
exports.addNoteStatus = async (objToSave) => {
	return await baseService.saveData(Models.UserJobApplyNotes, objToSave);
};
exports.addNoteStatusOnUserJobApply = async (criteria, objToSave) => {
	return await baseService.updateData(Models.UserJobApply, criteria, objToSave);
};

exports.UpdateNoteStatus = async (criteria, objToSave) => {
	return await baseService.updateData(
		Models.UserJobApplyNotes,
		criteria,
		objToSave
	);
};

exports.saveHide = async (objToSave) => {
	return await baseService.saveData(Models.SuggestedHide, objToSave);
};

//test
exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				jobTitle: {
					[Op.like]: "%" + criteria.search + "%",
				},
				location: {
					[Op.like]: "%" + criteria.search + "%",
				},
				workPlaceLocation: {
					[Op.like]: "%" + criteria.search + "%",
				},
				recuiterId: {
					[Op.or]: {
						[Op.in]: Sequelize.literal(
							`(SELECT id FROM recruiter WHERE recruiter.companyName like "%${criteria.search}%" or recruiter.email like "%${criteria.search}%")`
						),
						[Op.in]: Sequelize.literal(
							`(SELECT recruiterId FROM recruiter_users WHERE recruiter_users.fullName like "%${criteria.search}%")`
						),
					},
				},
				id: {
					[Op.or]: {
						[Op.in]: Sequelize.literal(
							`(SELECT jobPostId FROM job_post_skills inner join skills on job_post_skills.skillId= skills.id WHERE skills.name like "%${criteria.search}%")`
						),
						[Op.like]: "%" + criteria.search + "%",
					},
				},
			},
		};
	}
	if (criteria && criteria.benefitsId) {
		where = {
			[Op.or]: {
				id: {
					[Op.or]: {
						[Op.in]: Sequelize.literal(
							`(SELECT jobPostId FROM job_post_benefits WHERE benefitsId IN ("${criteria.benefitsId}"))`
						),
					},
				},
			},
		};
	}
	if (criteria && criteria.personalitiesIds) {
		where = {
			[Op.or]: {
				id: {
					[Op.or]: {
						[Op.in]: Sequelize.literal(
							`(SELECT jobPostId FROM job_post_personalities WHERE personalitiesId IN ("${criteria.personalitiesIds}"))`
						),
					},
				},
			},
		};
	}
	if (criteria && criteria.industryId) {
		where.industryId = { [Op.in]: criteria.industryId };
	}
	if (criteria && criteria.location) {
		where = {
			[Op.or]: {
				location: {
					[Op.like]: "%" + criteria.location + "%",
				},
			},
		};
	}
	if (criteria && criteria.categoryId) {
		where.categoryId = { [Op.in]: criteria.categoryId };
	}
	if (criteria && criteria.employementTypeId) {
		where.employementTypeId = { [Op.in]: criteria.employementTypeId };
	}
	if (criteria && criteria.travelRequirementId) {
		where.travelRequirementId = { [Op.in]: criteria.travelRequirementId };
	}
	if (criteria && criteria.jobEligibleForId) {
		where.jobEligibleForId = { [Op.in]: criteria.jobEligibleForId };
	}
	if (criteria && criteria.scheduleId) {
		where.scheduleId = { [Op.in]: criteria.scheduleId };
	}
	if (criteria && criteria.workPlaceLocation) {
		where.workPlaceLocation = { [Op.in]: criteria.workPlaceLocation };
	}
	if (criteria && criteria.minimum) {
		where.minimum =  { [Op.gte]: criteria.minimum } ;
	}
	if (criteria && criteria.maximum) {
		where.maximum =  { [Op.lte]: criteria.maximum } ;
	}
	if (criteria && criteria.rate) {
		where.rate = criteria.rate;
	}

	let order = [["createdAt", "DESC"]];
	if (criteria.sortBy && criteria.orderBy) {
		order = [[criteria.sortBy, criteria.orderBy]];
	}
	where.isDeleted = 0;
	if(criteria&&criteria.recruiterId){
		where.recuiterId=criteria.recruiterId;
	}
	
	if (criteria.isBlocked !== undefined) {
		where.isBlocked = criteria.isBlocked;
	}
	if (criteria.isConfirm == 1) {
		where.isConfirm = criteria.isConfirm;
	}
	return await baseService.count(Models.JobPosts, where, order);
};
//Use for future changes
// let include = {};
// (include = [                                        // Apply isDeleted=0 only for this include
// 	{ model: Models.JobPostAddQuestions,required:false, separate: true, where: { isDeleted: 0 }, },
// 	{ model: Models.JobPostBenefits ,required:false, separate: true, where: { isDeleted: 0 },},
// 	{ model: Models.JobPostNotificationEmails ,required:false, separate: true, where: { isDeleted: 0 },},
// 	{ model: Models.JobPostPersonalities,required:false , separate: true, where: { isDeleted: 0 },},
// 	{ model: Models.JobPostSkills ,required:false, separate: true, where: { isDeleted: 0 },},
// ]),
//test
exports.getListing = (criteria, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		if (criteria && criteria.jobTitle) {
			where = {
				[Op.or]: {
					jobTitle: {
						[Op.like]: "%" + criteria.jobTitle + "%",
					},
				},
			};
		}
		if (criteria && criteria.benefitsId) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT jobPostId FROM job_post_benefits WHERE benefitsId IN (${criteria.benefitsId}))`
							),
						},
					},
				},
			};
		}
		if (criteria && criteria.industryId) {
			where.industryId = { [Op.in]: criteria.industryId };
		}
		if (criteria && criteria.location) {
			where = {
				[Op.or]: {
					location: {
						[Op.like]: "%" + criteria.location + "%",
					},
				},
			};
		}
		if (criteria && criteria.categoryId) {
			where.categoryId = { [Op.in]: criteria.categoryId };
		}
		if (criteria && criteria.employementTypeId) {
			where.employementTypeId = { [Op.in]: criteria.employementTypeId };
		}
		if (criteria && criteria.minimum && criteria.maximum && criteria.rate) {
			where.minimum = criteria.minimum;
			where.maximum = criteria.maximum;
			where.rate = criteria.rate;
		}
		where.isDeleted = 0;
		Models.JobPosts.findAll({
			limit,
			offset,
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

Models.JobPosts.belongsTo(Models.JobPostSkills, {
	foreignKey: "jobPostId",
});

exports.getRecommandedJob = async (criteria,projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		if (criteria) {
			where = {
				id: {
					[Op.and]: {
						[Op.in]: Sequelize.literal(`(SELECT jobPostId FROM job_post_skills WHERE skillId IN (SELECT skillId FROM user_skills WHERE userId = "${criteria.userId}"))`),
					}
				}
			};
		}
		
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models.JobPosts.findAll({
			where: where,
			attributes: projection,
			limit,
			offset,
			include: [
				{
					model: Models.JobPostSkills,
					required: false,
				},
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
			],
			// having: {"isApplied" : { [Op.ne] :  1} }
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

Models.JobPosts.belongsTo(Models.Recruiter, {
	foreignKey: "recuiterId",
});

Models.JobPosts.belongsTo(Models.EmploymentTypes, {
	foreignKey: "employementTypeId",
});
Models.JobPosts.hasOne(Models.JobPostSupplementPay, {
	foreignKey: "jobPostId",
});

Models.JobPosts.hasOne(Models.JobPostAddress, {
	foreignKey: "jobPostId",
});

exports.getListings = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		if (criteria && criteria.industryId) {
			where.industryId = criteria.industryId;
		}
		if (criteria && criteria.jobTitle) {
			where = {
				[Op.or]: {
					jobTitle: {
						[Op.like]: "%" + criteria.jobTitle + "%",
					},
				},
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models.JobPosts.findAll({
			limit,
			offset,
			where: where,
			attributes: projection,
			include: [
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
			],
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getLatest = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		Models.JobPosts.findAll({
			limit,
			offset,
			where: where,
			attributes: projection,
			include: [
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
			],
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

Models.JobPosts.hasOne(Models.JobPostSkills, {
	foreignKey: "jobPostId",
});
Models.JobPostSkills.belongsTo(Models.Skills, {
	foreignKey: "skillId",
});

Models.JobPosts.hasOne(Models.JobPostBenefits, {
	foreignKey: "jobPostId",
});

Models.JobPostBenefits.belongsTo(Models.Benefits, {
	foreignKey: "benefitsId",
});

Models.JobPosts.hasOne(Models.JobPostSupplementPay, {
	foreignKey: "jobPostId",
});

Models.JobPostSupplementPay.belongsTo(Models.Supplements, {
	foreignKey: "supplementalPayId",
});

exports.getAppListing = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [
			["createdAt", "DESC"],
			// ,[Sequelize.literal("distance")]
		];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					jobTitle: {
						[Op.like]: "%" + criteria.search + "%",
					},
					location: {
						[Op.like]: "%" + criteria.search + "%",
					},
					workPlaceLocation: {
						[Op.like]: "%" + criteria.search + "%",
					},
					recuiterId: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT id FROM recruiter WHERE recruiter.companyName like "%${criteria.search}%" or recruiter.email like "%${criteria.search}%" or recruiter.phoneNumber like "%${criteria.search}%")`
							),
							[Op.in]: Sequelize.literal(
								`(SELECT recruiterId FROM recruiter_users WHERE recruiter_users.fullName like "%${criteria.search}%")`
							),
						},
					},
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT jobPostId FROM job_post_skills inner join skills on job_post_skills.skillId= skills.id WHERE skills.name like "%${criteria.search}%")`
							),
							[Op.like]: "%" + criteria.search + "%",
						},
					},
				},
			};
		}
		if (criteria && criteria.benefitsId) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT jobPostId FROM job_post_benefits WHERE benefitsId IN ("${criteria.benefitsId}"))`
							),
						},
					},
				},
			};
		}
		if (criteria && criteria.personalitiesIds) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT jobPostId FROM job_post_personalities WHERE personalitiesId IN ("${criteria.personalitiesIds}"))`
							),
						},
					},
				},
			};
		}
		if (criteria && criteria.industryId) {
			where.industryId = { [Op.in]: criteria.industryId };
		}
		if (criteria && criteria.location) {
			where = {
				[Op.or]: {
					location: {
						[Op.like]: "%" + criteria.location + "%",
					},
				},
			};
		}
		if (criteria && criteria.categoryId) {
			where.categoryId = { [Op.in]: criteria.categoryId };
		}
		if (criteria && criteria.workPlaceLocation) {
			where.workPlaceLocation = { [Op.in]: criteria.workPlaceLocation };
		}
		if (criteria && criteria.employementTypeId) {
			where.employementTypeId = { [Op.in]: criteria.employementTypeId };
		}
		if (criteria && criteria.travelRequirementId) {
			where.travelRequirementId = { [Op.in]: criteria.travelRequirementId };
		}
		if (criteria && criteria.jobEligibleForId) {
			where.jobEligibleForId = { [Op.in]: criteria.jobEligibleForId };
		}
		if (criteria && criteria.scheduleId) {
			where.scheduleId = { [Op.in]: criteria.scheduleId };
		}
		if (criteria && criteria.minimum) {
			where.minimum =  { [Op.gte]: criteria.minimum } ;
		}
		if (criteria && criteria.maximum) {
			where.maximum =  { [Op.lte]: criteria.maximum } ;
		}
		if (criteria && criteria.rate) {
			where.rate = criteria.rate;
		}
		where.isDeleted = 0;
		if(criteria&&criteria.recruiterId){
			where.recuiterId=criteria.recruiterId;
		}
		if (criteria && criteria.isBlocked !== undefined) {
			where.isBlocked = criteria.isBlocked;
		}
		if (criteria && criteria.isConfirm == 1) {
			where.isConfirm = criteria.isConfirm;
		}

		console.log("this is where======>", where);
		Models.JobPosts.findAll({
			limit,
			offset,
			attributes: projection,
			include: [
				{
					model: Models.JobPostAddress,
					required: false,
					attributes: [
						"id",
						"location",
						"state",
						"city",
						"zipCode",
						"latitude",
						"longitude",
					],
				},
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
				{
					model: Models.JobPostSkills,
					required: false,
					attributes: ["id", "skillId", "jobPostId"],
					include: [
						{
							model: Models.Skills,
							required: false,
							attributes: ["id", "name"],
						},
					],
				},
				{
					model: Models.JobPostBenefits,
					required: false,
					attributes: ["id", "benefitsId", "jobPostId"],
					include: [
						{
							model: Models.Benefits,
							required: false,
							attributes: ["id", "name"],
						},
					],
				},
				{
					model: Models.JobPostSupplementPay,
					required: false,
					attributes: ["id", "supplementalPayId", "jobPostId"],
					include: [
						{
							model: Models.Supplements,
							required: false,
							attributes: ["id", "name"],
						},
					],
				},
			],
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getAllRecords = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		Models.JobPosts.findAll({
			limit,
			offset,
			attributes: projection,
			include: [
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
			],
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getAllRecordsCompany = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		where.recuiterId = criteria.recuiterId;
		Models.JobPosts.findAll({
			where: where,
			limit,
			offset,
			attributes: projection,
			include: [
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
			],
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getAllRecordsCount = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		where.recuiterId = criteria.recuiterId;
		Models.JobPosts.count({
			where: where,
			limit,
			offset,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getSingleRecord = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		where.id = criteria.id;
		Models.JobPosts.findOne({
			attributes: projection,
			include: [
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
			],
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

// Models.Users.hasMany(Models.UserJobApply, {
// 	foreignKey: "jobPostId",
// });

Models.UserJobApply.belongsTo(Models.Users, {
	foreignKey: "userId",
});
Models.UserJobApply.belongsTo(Models.JobPosts, {
	foreignKey: "jobPostId",
	as: "jobPosts",
});

Models.JobPosts.belongsTo(Models.Recruiter,{
	foreignKey:"recuiterId",
});
Models.JobPosts.belongsTo(Models.Recruiter,{
	foreignKey:"subRecuiterId",
});

exports.getApplicant = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		if (criteria.status !== undefined) {
			where.status = criteria.status;
		}
		if (criteria) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(select user_job_apply.id from user_job_apply  where user_job_apply.userId not in(select suggested_hide.userId from  suggested_hide where suggested_hide.jobPostId="${criteria.id}" and isDeleted=0))`
					),
				},
			};
		}
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					id: {
						[Op.in]: Sequelize.literal(
							`(SELECT user_job_apply.id FROM user_job_apply inner join users on user_job_apply.userId= users.id WHERE users.name like "%${criteria.search}%"OR users.location LIKE "%${criteria.search}%" OR users.phoneNumber LIKE "%${criteria.search}%" OR users.email LIKE "%${criteria.search}%")`
						),
					},
				},
			};
		}
		where.jobPostId = criteria.id;
		Models.UserJobApply.findAll({
			limit,
			offset,
			where: where,
			include: [
				{
					model: Models.Users,required:false,
					attributes:["id","name","email","location","phoneNumber","profileImage"],
				},
				{
					model: Models.JobPosts,
					attributes: ["id","recuiterId","subRecuiterId","userType"],
					required: false,
					as: "jobPosts",
					include:[
						{
							model:Models.Recruiter,
							require:false,
							attributes:["id","name","companyName","profileImage"]
						},
						{
							model:Models.Recruiter,
							require:false,
							attributes:["id","name","profileImage"]
						}
					]
				},
			],
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getCount = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};
		if (criteria.status !== undefined) {
			where.status = criteria.status;
		}
		if (criteria) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(select user_job_apply.id from user_job_apply  where user_job_apply.userId not in(select suggested_hide.userId from  suggested_hide where suggested_hide.jobPostId="${criteria.id}" and isDeleted=0))`
					),
				},
			};
		}
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					id: {
						[Op.in]: Sequelize.literal(
							`(SELECT user_job_apply.id FROM user_job_apply inner join users on user_job_apply.userId= users.id WHERE users.name like "%${criteria.search}%"OR users.location LIKE "%${criteria.search}%" OR users.phoneNumber LIKE "%${criteria.search}%"  OR users.email LIKE "%${criteria.search}%")`
						),
					},
				},
			};
		}
		where.isDeleted = 0;
		where.jobPostId = criteria.id;
		Models.UserJobApply.count({
			where: where,
			include: [
				{
					model: Models.Users,
					required: false,
					attributes: ["id", "name", "email", "location", "phoneNumber"],
				},
			],
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getApplicants = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		if (criteria.status !== undefined) {
			where.status = criteria.status;
		}
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					id: {
						[Op.in]: Sequelize.literal(
							`(SELECT user_job_apply.id FROM user_job_apply inner join users on user_job_apply.userId= users.id WHERE users.name like "%${criteria.search}%"OR users.location LIKE "%${criteria.search}%" OR users.phoneNumber LIKE "%${criteria.search}%")`
						),
					},
				},
			};
		}
		where.jobPostId = criteria.id;
		where.userId = criteria.userId;
		Models.UserJobApply.findOne({
			where: where,
			attributes: projection,
			include: [
				{
					model: Models.Users,
					required: false,
					attributes: ["id", "name", "email", "location", "phoneNumber"],
				},
			],
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getOne = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		if (criteria.status !== undefined) {
			where.status = criteria.status;
		}
		where.id = criteria.id;
		Models.JobPosts.findOne({
			where: where,
			attributes: projection,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getSuggestedCandidate = async (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["name", "asc"]];
		if (criteria) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							// [Op.in]: Sequelize.literal(	`(select user_job_preferences_industries.userId  from user_job_preferences_industries
							// 	inner join job_posts on user_job_preferences_industries.industryId=job_posts.industryId GROUP BY userId)`
							// )
							// [Op.in]: Sequelize.literal(	"(SELECT user_job_preferences_industries.userId FROM user_job_preferences_industries LEFT JOIN user_job_apply ON user_job_preferences_industries.userId = user_job_apply.userId WHERE user_job_apply.userId IS NULL GROUP BY userId)"
							// )
							// [Op.in]: Sequelize.literal(	"(SELECT user_job_preferences_industries.userId FROM user_job_preferences_industries LEFT JOIN user_job_apply  ON user_job_preferences_industries.userId = user_job_apply.userId LEFT JOIN suggested_hide ON user_job_preferences_industries.userId = suggested_hide.userId WHERE user_job_apply.userId IS NULL AND suggested_hide.userId IS NULL  GROUP BY user_job_preferences_industries.userId)"
							// [Op.in]: Sequelize.literal(	`((SELECT ( user_skills.userId) FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "%${criteria.jobPostId }%  AND NOT EXISTS (SELECT 1 FROM user_job_apply WHERE user_job_apply.jobPostId = "%${criteria.jobPostId }%  AND user_job_apply.userId = user_skills.userId AND user_job_apply.isDeleted = 0) AND NOT EXISTS (SELECT 1 FROM suggested_hide WHERE suggested_hide.jobPostId ="%${criteria.jobPostId }% AND suggested_hide.recruiterId = "%${criteria.recuiterId }%  AND suggested_hide.userId = user_skills.userId AND suggested_hide.isDeleted = 0))`
							// )
							// [Op.in]: Sequelize.literal(	`(SELECT distinct( user_skills.userId) FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId }"  AND NOT EXISTS (SELECT 1 FROM user_job_apply WHERE user_job_apply.jobPostId = "${criteria.jobPostId }" AND user_job_apply.userId = user_skills.userId AND user_job_apply.isDeleted = 0) AND NOT EXISTS (SELECT 1 FROM suggested_hide WHERE suggested_hide.jobPostId ="${criteria.jobPostId }" AND suggested_hide.recruiterId = "${criteria.recuiterId }"  AND suggested_hide.userId = user_skills.userId AND suggested_hide.isDeleted = 0))`
							// )
							// [Op.in]: Sequelize.literal(	`(SELECT (user_skills.userId) FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT user_job_apply.userId FROM user_job_apply WHERE user_job_apply.jobPostId = "${criteria.jobPostId}" AND user_job_apply.isDeleted = 0) AND user_skills.userId NOT IN (SELECT suggested_hide.userId FROM suggested_hide WHERE suggested_hide.jobPostId ="${criteria.jobPostId}" AND suggested_hide.recruiterId = "${criteria.recruiterId}" AND suggested_hide.isDeleted = 0 AND suggested_hide.userId IS NOT NULL) AND user_skills.userId NOT IN (SELECT user_skills.userId FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId INNER JOIN user_job_apply ON user_job_apply.jobPostId = job_post_skills.jobPostId WHERE user_job_apply.userId = user_skills.userId AND user_job_apply.isDeleted = 0 ) AND user_skills.userId NOT IN (SELECT user_skills.userId FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId INNER JOIN suggested_hide ON suggested_hide.jobPostId = job_post_skills.jobPostId WHERE suggested_hide.userId = user_skills.userId AND suggested_hide.recruiterId = "${criteria.recruiterId}" AND suggested_hide.isDeleted = 0))`
							// )
							[Op.in]: Sequelize.literal(
								`(SELECT DISTINCT ((user_skills.userId)) FROM user_skills as user_skills INNER JOIN job_post_skills as job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT * FROM ((SELECT userId FROM user_job_apply WHERE jobPostId = "${criteria.jobPostId}" AND isDeleted = 0) UNION ALL (SELECT userId FROM suggested_hide WHERE jobPostId = "${criteria.jobPostId}" AND recruiterId = "${criteria.recuiterId}")) as subQuery_alias group by user_skills.userId))`
							),
						},
					},
				},
			};
		}
		if (criteria && criteria.search) {
			where = {
				[Op.and]: {
					[Op.or]: {
						name: {
							[Op.like]: "%" + criteria.search + "%",
						},
						location: {
							[Op.like]: "%" + criteria.search + "%",
						},
					},
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT DISTINCT ((user_skills.userId)) FROM user_skills as user_skills INNER JOIN job_post_skills as job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT * FROM ((SELECT userId FROM user_job_apply WHERE jobPostId = "${criteria.jobPostId}" AND isDeleted = 0) UNION ALL (SELECT userId FROM suggested_hide WHERE jobPostId = "${criteria.jobPostId}" )) as subQuery_alias group by user_skills.userId))`
							),
						},
					},
				},
			};
		}
		// where.isDeleted=0;
		// where.isBlocked = 0;
		Models.Users.findAll({
			where: where,
			attributes: projection,
			limit,
			offset,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getCountSuggested = async (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["name", "asc"]];
		if (criteria) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							// [Op.in]: Sequelize.literal(	`(select user_job_preferences_industries.userId  from user_job_preferences_industries
							// 	inner join job_posts on user_job_preferences_industries.industryId=job_posts.industryId GROUP BY userId)`
							// )
							// [Op.in]: Sequelize.literal(	"(SELECT user_job_preferences_industries.userId FROM user_job_preferences_industries LEFT JOIN user_job_apply  ON user_job_preferences_industries.userId = user_job_apply.userId LEFT JOIN suggested_hide ON user_job_preferences_industries.userId = suggested_hide.userId WHERE user_job_apply.userId IS NULL AND suggested_hide.userId IS NULL  GROUP BY user_job_preferences_industries.userId)"
							// )
							// [Op.in]: Sequelize.literal(	`(SELECT distinct( user_skills.userId) FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId }"  AND NOT EXISTS (SELECT 1 FROM user_job_apply WHERE user_job_apply.jobPostId = "${criteria.jobPostId }" AND user_job_apply.userId = user_skills.userId AND user_job_apply.isDeleted = 0) AND NOT EXISTS (SELECT 1 FROM suggested_hide WHERE suggested_hide.jobPostId ="${criteria.jobPostId }" AND suggested_hide.recruiterId = "${criteria.recuiterId }"  AND suggested_hide.userId = user_skills.userId AND suggested_hide.isDeleted = 0))`
							// )
							// [Op.in]: Sequelize.literal(	`(SELECT (user_skills.userId) FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT user_job_apply.userId FROM user_job_apply WHERE user_job_apply.jobPostId = "${criteria.jobPostId}" AND user_job_apply.isDeleted = 0) AND user_skills.userId NOT IN (SELECT suggested_hide.userId FROM suggested_hide WHERE suggested_hide.jobPostId ="${criteria.jobPostId}" AND suggested_hide.recruiterId = "${criteria.recruiterId}" AND suggested_hide.isDeleted = 0 AND suggested_hide.userId IS NOT NULL) AND user_skills.userId NOT IN (SELECT user_skills.userId FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId INNER JOIN user_job_apply ON user_job_apply.jobPostId = job_post_skills.jobPostId WHERE user_job_apply.userId = user_skills.userId AND user_job_apply.isDeleted = 0 ) AND user_skills.userId NOT IN (SELECT user_skills.userId FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId INNER JOIN suggested_hide ON suggested_hide.jobPostId = "${criteria.jobPostId}" WHERE suggested_hide.userId = user_skills.userId AND suggested_hide.recruiterId = "${criteria.recruiterId}" AND suggested_hide.isDeleted = 0))`
							// )
							// [Op.in]: Sequelize.literal(	`(SELECT (user_skills.userId) FROM user_skills INNER JOIN job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT userId FROM user_job_apply WHERE jobPostId =  "${criteria.jobPostId}" AND isDeleted = 0 UNION SELECT userId FROM suggested_hide WHERE jobPostId =  "${criteria.jobPostId}" AND recruiterId = "${criteria.recruiterId}" AND isDeleted = 0) AND user_skills.isDeleted = 0 AND job_post_skills.isDeleted = 0)`
							// )
							[Op.in]: Sequelize.literal(
								`(SELECT DISTINCT ((user_skills.userId)) FROM user_skills as user_skills INNER JOIN job_post_skills as job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT * FROM ((SELECT userId FROM user_job_apply WHERE jobPostId = "${criteria.jobPostId}" AND isDeleted = 0) UNION ALL (SELECT userId FROM suggested_hide WHERE jobPostId = "${criteria.jobPostId}"  AND recruiterId = "${criteria.recuiterId}")) as subQuery_alias group by user_skills.userId))`
							),
						},
					},
				},
			};
		}
		// where.isDeleted=0;
		// where.isBlocked = 0;
		if (criteria && criteria.search) {
			where = {
				[Op.and]: {
					[Op.or]: {
						name: {
							[Op.like]: "%" + criteria.search + "%",
						},
						location: {
							[Op.like]: "%" + criteria.search + "%",
						},
					},
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(
								`(SELECT DISTINCT ((user_skills.userId)) FROM user_skills as user_skills INNER JOIN job_post_skills as job_post_skills ON job_post_skills.skillId = user_skills.skillId WHERE job_post_skills.jobPostId = "${criteria.jobPostId}" AND user_skills.userId NOT IN (SELECT * FROM ((SELECT userId FROM user_job_apply WHERE jobPostId = "${criteria.jobPostId}" AND isDeleted = 0) UNION ALL (SELECT userId FROM suggested_hide WHERE jobPostId = "${criteria.jobPostId}" )) as subQuery_alias group by user_skills.userId))`
							),
						},
					},
				},
			};
		}
		Models.Users.count({
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getAllNoteRecord = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		console.log("change---------------->", criteria);
		where.isDeleted = 0;
		if (criteria.filter && criteria.filter == 1) {
			where.recruiterId = criteria.recruiterId;
		}
		// where.userId=criteria.userId;
		console.log("Where-=======>", where);

		Models.UserJobApplyNotes.findAll({
			where: where,
			limit,
			offset,
			attributes: projection,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getUserScreeningQuestion = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		where.userId = criteria.userId;
		Models.UserScreeningQuestion.findAll({
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.activityPerformByAllRecruiterOnCandidate = (
	criteria,
	projection,
	limit,
	offset
) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		where.isDeleted = 0;
		if (criteria.filter && criteria.filter == 1) {
			where.recuiterId = criteria.recruiterId;
		}
		where.userId = criteria.userId;
		Models.RecruiterView.findAll({
			where: where,
			limit,
			offset,
			attributes: projection,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getActiveJobsListing = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [
			["createdAt", "DESC"],
			// ,[Sequelize.literal("distance")]
		];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}

		if (criteria && criteria.recruiterId) {
			where.recuiterId = criteria.recruiterId;
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		where.isConfirm = 1;

		Models.JobPosts.findAll({
			limit,
			offset,
			attributes: projection,
			include: [
				{
					model: Models.JobPostAddress,
					required: false,
					attributes: [
						"id",
						"location",
						"state",
						"city",
						"zipCode",
						"latitude",
						"longitude",
					],
				},
				{
					model: Models.EmploymentTypes,
					required: false,
					attributes: ["id", "name"],
				},
				{
					model: Models.Recruiter,
					required: false,
					attributes: ["id", "companyName", "location", "profileImage"],
				},
				{
					model: Models.JobPostSkills,
					required: false,
					attributes: ["id", "skillId", "jobPostId"],
					include: [
						{
							model: Models.Skills,
							required: false,
							attributes: ["id", "name"],
						},
					],
				},
				{
					model: Models.JobPostBenefits,
					required: false,
					attributes: ["id", "benefitsId", "jobPostId"],
					include: [
						{
							model: Models.Benefits,
							required: false,
							attributes: ["id", "name"],
						},
					],
				},
				{
					model: Models.JobPostSupplementPay,
					required: false,
					attributes: ["id", "supplementalPayId", "jobPostId"],
					include: [
						{
							model: Models.Supplements,
							required: false,
							attributes: ["id", "name"],
						},
					],
				},
			],
			where: where,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getAllUserDetail = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};
		where.isDeleted = 0;
		where.jobPostId = criteria.id;
		Models.UserJobApply.findAll({
			where: where,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getPlanIdFrpmRecruiterTransaction = (id) => {
	return new Promise((resolve, reject) => {
		let where = {};			
		where.isDeleted = 0;
		where.isBlocked = 0;
		where.recruiterId=id;
		Models
			.RecruiterTransaction
			.findOne({
				attributes: ["id","recruiterId","planId","planName","planType","status","isSubscription"],
				where: where,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};