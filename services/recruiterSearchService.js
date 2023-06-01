"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");
var moment = require("moment");
Models.Users.hasMany(Models.UserSkills, {
	foreignKey: "userId",
	as: "userSkillDetails",
});

Models.UserSkills.belongsTo(Models.Skills, {
	foreignKey: "skillId",
	as: "skills",
});
Models.Users.hasMany(Models.UserEducations, {
	foreignKey: "userId",
	as: "userEducationDetails",
});

Models.Users.hasMany(Models.UserWorkExperiences, {
	foreignKey: "userId",
	// as: "userWorkExperiences",
});

Models.UserWorkExperiences.belongsTo(Models.EmploymentTypes, {
	foreignKey: "employementTypeId",
	as: "employmentType",
});

Models.UserEducations.belongsTo(Models.Specializations, {
	foreignKey: "specializationId",
	// as: "specialization",
});
Models.UserEducations.belongsTo(Models.Universities, {
	foreignKey: "universityId",
	as: "university",
});

exports.getUserListing = (criteria,projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		if (criteria && criteria.search) {
			let str = "0 ";
			for (let i = 0; i < criteria.search.length; i++) {
				str =
					str +
					`or user_work_experiences.jobTitle LIKE "%${criteria.search[i]}%"`;
			}
			console.log(str, "this is string");
			where = {
				[Op.or]: {
					id: {
						[Op.in]: Sequelize.literal(
							`(SELECT user_work_experiences.userId FROM user_work_experiences WHERE ${str} )`
						),
					},
				},
			};
		}
		if (criteria && criteria.personalityTest) {
			where.personalityTest = {
				[Op.in]: criteria.personalityTest.map((id) => `"${id}"`).join(","),
			};
		}
		if (criteria && criteria.location) {
			where = {
				[Op.or]: {
					zipCode: {
						[Op.like]: "%" + criteria.location + "%",
					},
					location: {
						[Op.like]: "%" + criteria.location + "%",
					},
				},
			};
		}
		if (criteria && criteria.skillId) {
			where = {
				id: {
					[Op.in]:
						// Sequelize.literal(
						// 	`(SELECT userId FROM user_skills WHERE skillId IN ("${criteria.skillId}"))`
						// ),
						Sequelize.literal(
							`(SELECT userId FROM user_skills WHERE skillId IN (${criteria.skillId
								.map((id) => `"${id}"`)
								.join(",")}))`
						),
				},
			};
		}
		if (criteria && criteria.industryId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences_industries WHERE user_job_preferences_industries.industryId IN (${criteria.industryId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.language) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_langauges WHERE language IN (${criteria.language
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.workExperiences) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_work_experiences WHERE DATEDIFF(toDate, fromDate) >=(${criteria.workExperiences}))`
					),
				},
			};
		}
		if (criteria && criteria.specializationId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						// `(SELECT userId FROM user_educations WHERE specializationId IN ("${criteria.specializationId.map(id => `"${id}"`).join(",")}"))`
						`(SELECT userId FROM user_educations WHERE specializationId IN (${criteria.specializationId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.travelRequirementId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences_travel_requirements WHERE travelRequirementId IN (${criteria.travelRequirementId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.securityClearanceId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences_security_clearance WHERE securityClearanceId IN (${criteria.securityClearanceId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.employementTypeId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences WHERE employementTypeId IN (${criteria.employementTypeId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.willingToRelocate) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences WHERE willingToRelocate IN ("${criteria.willingToRelocate}"))`
					),
				},
			};
		}
		if (criteria && criteria.workPlace) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences WHERE workPlace IN (${criteria.workPlace
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.jobTitleId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences_job_titles WHERE jobTitleId IN (${criteria.jobTitleId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.jobPreferenceId) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences_job_titles WHERE jobPreferenceId IN (${criteria.jobPreferenceId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
				},
			};
		}
		if (criteria && criteria.salary) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences WHERE desiredSalary IN (${criteria.salary}))`
					),
				},
			};
		}
		if (criteria && criteria.availability == 1) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_job_preferences WHERE dateOfAvailability <= ("${new Date().toJSON()}"))`
					),
				},
			};
		}
		if (criteria && criteria.vaternStatus) {
			where.userType = {
				[Op.in]: criteria.vaternStatus
					.map((status) => `'${status}'`)
					.join(",")
					.replace(/'/g, "")
					.split(","),
			};
		}
		if (criteria && criteria.resumeLastUpdate) {
			var lastThreeMonths;
			if(criteria.resumeLastUpdate==1){
				lastThreeMonths = moment().subtract(30, "d").format("YYYY-MM-DD HH:mm:ss");
			}else if(criteria.resumeLastUpdate==2){
				lastThreeMonths = moment().subtract(90, "d").format("YYYY-MM-DD HH:mm:ss");
			}else if(criteria.resumeLastUpdate==3){
				lastThreeMonths = moment().subtract(180, "d").format("YYYY-MM-DD HH:mm:ss");
			}
			
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM user_resume_status WHERE updatedAt BETWEEN("${lastThreeMonths}") and  ("${new Date()}") )`
					),
				},
			};
		}
		if (criteria && criteria.excludeCandidate) {
			where = {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT userId FROM recruiter_view WHERE actionType in ("${criteria.excludeCandidate}") )`
					),
				},
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models.Users.findAll({
			limit,
			offset,
			attributes:projection,
			include: [
				{
					model: Models.UserSkills,
					attributes: ["id","otherTitle","createdAt","updatedAt"],
					as: "userSkillDetails",
					include: [
						{
							model: Models.Skills,
							attributes: ["id", "name","isOrderBy","createdAt","updatedAt"],
							as: "skills",
						},
					],
				},
				{
					model: Models.UserEducations,
					attributes: ["id","createdAt","updatedAt","fromDate","toDate","specializationId","universityId","gpa","description","isPursuing","otherTitleUniveristy","otherTitleSpecialization"],
					as: "userEducationDetails",
					include: [
						{
							model: Models.Specializations,
							attributes: ["id", "name","createdAt","updatedAt"],
							// as: "specialization",
						},
						{
							model: Models.Universities,
							attributes: ["id", "name","createdAt","updatedAt"],
							as: "university",
						},
					],
				},
				{
					model: Models.UserWorkExperiences,
					attributes: ["id","createdAt","updatedAt","fromDate","toDate","jobTitle","companyName","employementTypeId","description","location","zipCode","underContractOf","isCurrentlyRole"],
					// as: "userWorkExperiences",
					include: [
						{
							model: Models.EmploymentTypes,
							attributes: ["id", "name","createdAt","updatedAt"],
							as: "employmentType",
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


Models.SubCategories.belongsTo(Models.Categories, {
	foreignKey: "categoryId",
	// as: "subCategory"
});

Models.Categories.hasMany(Models.SubCategories, {
	foreignKey: "categoryId",
	// as: "categoryDetails"
});

exports.count = async (criteria) => {
	let where = {};
	let order = [["createdAt", "DESC"]];
	if (criteria.sortBy && criteria.orderBy) {
		order = [[criteria.sortBy, criteria.orderBy]];
	}
	if (criteria && criteria.search) {
		let str = "0 ";
		for (let i = 0; i < criteria.search.length; i++) {
			str =
					str +
					`or user_work_experiences.jobTitle LIKE "%${criteria.search[i]}%"`;
		}
		where = {
			[Op.or]: {
				id: {
					[Op.in]: Sequelize.literal(
						`(SELECT user_work_experiences.userId FROM user_work_experiences WHERE  ${str} )`
					),
				},
			},
		};
	}
	if (criteria && criteria.personalityTest) {
		where.personalityTest = {
			[Op.in]: criteria.personalityTest.map((id) => `"${id}"`).join(","),
		};
	}
	if (criteria && criteria.location) {
		where = {
			[Op.or]: {
				zipCode: {
					[Op.like]: "%" + criteria.location + "%",
				},
				location: {
					[Op.like]: "%" + criteria.location + "%",
				},
			},
		};
	}
	if (criteria && criteria.skillId) {
		where = {
			id: {
				[Op.in]:
					// Sequelize.literal(
					// 	`(SELECT userId FROM user_skills WHERE skillId IN ("${criteria.skillId}"))`
					// ),
					Sequelize.literal(
						`(SELECT userId FROM user_skills WHERE skillId IN (${criteria.skillId
							.map((id) => `"${id}"`)
							.join(",")}))`
					),
			},
		};
	}
	if (criteria && criteria.industryId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences_industries WHERE user_job_preferences_industries.industryId IN (${criteria.industryId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.language) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_langauges WHERE language IN (${criteria.language
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.workExperiences) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_work_experiences WHERE DATEDIFF(toDate, fromDate) >=(${criteria.workExperiences}))`
				),
			},
		};
	}
	if (criteria && criteria.specializationId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_educations WHERE specializationId IN (${criteria.specializationId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.travelRequirementId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences_travel_requirements WHERE travelRequirementId IN (${criteria.travelRequirementId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.securityClearanceId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences_security_clearance WHERE securityClearanceId IN (${criteria.securityClearanceId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.employementTypeId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences WHERE employementTypeId IN (${criteria.employementTypeId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.willingToRelocate) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences WHERE willingToRelocate IN ("${criteria.willingToRelocate}"))`
				),
			},
		};
	}
	if (criteria && criteria.workPlace) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences WHERE workPlace IN (${criteria.workPlace
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.jobTitleId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences_job_titles WHERE jobTitleId IN (${criteria.jobTitleId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.jobPreferenceId) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences_job_titles WHERE jobPreferenceId IN (${criteria.jobPreferenceId
						.map((id) => `"${id}"`)
						.join(",")}))`
				),
			},
		};
	}
	if (criteria && criteria.salary) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences WHERE desiredSalary IN (${criteria.salary}))`
				),
			},
		};
	}
	if (criteria && criteria.availability == 1) {
		where = {
			id: {
				[Op.in]: Sequelize.literal(
					`(SELECT userId FROM user_job_preferences WHERE dateOfAvailability <= ("${new Date().toJSON()}"))`
				),
			},
		};
	}
	if (criteria && criteria.vaternStatus) {
		where.userType = {
			[Op.in]: criteria.vaternStatus
				.map((status) => `'${status}'`)
				.join(",")
				.replace(/'/g, "")
				.split(","),
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.Users, where, order);
};

exports.countCategories = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%",
			},
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.Categories, where);
};
exports.getCategories = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let wheres = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		if (criteria && criteria.search) {
			where = {
				name: {
					[Op.like]: "%" + criteria.search + "%",
				},
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		wheres.isDeleted = 0;
		wheres.isBlocked = 0;
		Models.Categories.findAll({
			attributes: projection,
			where: where,
			include: [
				{
					model: Models.SubCategories,
					where: wheres,
					//attributes: ["id", "name"],
					required: false,
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

exports.getListingSubCategories = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [["createdAt", "DESC"]];
		if (criteria.sortBy && criteria.orderBy) {
			order = [[criteria.sortBy, criteria.orderBy]];
		}
		if (criteria && criteria.search) {
			where = {
				name: {
					[Op.like]: "%" + criteria.search + "%",
				},
			};
		}
		if (criteria && criteria.categoryId) {
			where.categoryId = criteria.categoryId;
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models.SubCategories.findAll({
			where: where,
			include: [
				{
					model: Models.Categories,
					attributes: ["id", "name"],
					required: false,
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

exports.countSubCategories = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%",
			},
		};
	}
	if (criteria && criteria.categoryId) {
		where.categoryId = criteria.categoryId;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.SubCategories, where);
};

exports.getSearch = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = [["id", "DESC"]];
		let where={};
		where.recuiterId=criteria.recuiterId;
		where.isDeleted=0;
		where.isBlocked=0;
		Models.RecruiterSearchKey.findAll({
			limit,
			offset,
			where: where,
			attributes: projection,
			order: order
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};
exports.countSaveSearch = async (criteria) => {
	let where = {};
	where.recuiterId=criteria.recuiterId;
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.RecruiterSearchKey, where);
};