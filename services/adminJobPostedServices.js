
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
exports.BlockData = async (ModelsSend, criteria, objToSave) => {
	return await baseService.updateData(ModelsSend, criteria, objToSave);
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
					[Op.in]: Sequelize.literal(	`(SELECT id FROM recruiter WHERE recruiter.companyName like "%${criteria.search }%")`
					)
				},
				id: {
					[Op.in]: Sequelize.literal(	`(SELECT jobPostId FROM job_post_skills inner join skills on job_post_skills.skillId= skills.id WHERE skills.name like "%${criteria.search }%")`
					)
				},
			},
		};
	}
	if (criteria && criteria.benefitsId ) {
		where = {
			[Op.or]: {
				id: {
					[Op.or]: {
						[Op.in]: Sequelize.literal(	`(SELECT jobPostId FROM job_post_benefits WHERE benefitsId IN ("${criteria.benefitsId }"))`
						)
					},
				},
			},
		};
	}
	if (criteria && criteria.personalitiesIds ) {
		where = {
			[Op.or]: {
				id: {
					[Op.or]: {
						[Op.in]: Sequelize.literal(	`(SELECT jobPostId FROM job_post_personalities WHERE personalitiesId IN ("${criteria.personalitiesIds }"))`
						)
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
	if (criteria && criteria.recuiterId) {
		where.recuiterId= criteria.recuiterId;
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
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.JobPosts, where);
};

exports.getListing = (criteria,projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}

		if (criteria && criteria.search) {
			where = {
				jobTitle: {
					[Op.like]: "%" + criteria.search + "%",
				}
			};
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
		if (criteria && criteria.benefitsId ) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(	`(SELECT jobPostId FROM job_post_benefits WHERE benefitsId IN (${criteria.benefitsId }))`
							)
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
		if (criteria && criteria.personalitiesIds ) {
			where = {
				[Op.or]: {
					id: {
						[Op.or]: {
							[Op.in]: Sequelize.literal(	`(SELECT jobPostId FROM job_post_personalities WHERE personalitiesId IN ("${criteria.personalitiesIds }"))`
							)
						},
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
		if (criteria && criteria.minimum &&criteria.maximum&&criteria.rate) {
			where.minimum=criteria.minimum;
			where.maximum=criteria.maximum;
			where.rate=criteria.rate;
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
		
		if (criteria && criteria.recuiterId) {
			where.recuiterId =  criteria.recuiterId;
		}
		where.isDeleted = 0;
		Models.JobPosts.findAll({
			limit,
			offset,
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


