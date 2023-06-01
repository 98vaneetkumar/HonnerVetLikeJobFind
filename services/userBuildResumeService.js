"use strict";
//const Sequelize = require("sequelize");
//const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

// User skills reference

Models.UserSkills.belongsTo(Models.Skills, {
	foreignKey: "skillId",
	as: "skillDetails"
});
// Education references
Models.UserEducations.belongsTo(Models.Universities, {
	foreignKey: "universityId",
	as: "universityDetails"
});
Models.UserEducations.belongsTo(Models.Specializations, {
	foreignKey: "specializationId",
	as: "specializationDetails"
});

// Work experience reference
Models.UserWorkExperiences.belongsTo(Models.EmploymentTypes, {
	foreignKey: "employementTypeId",
	as: "employementTypeDetails"
});

// Volunteer experience reference
Models.UserVolunteerExperiences.belongsTo(Models.EmploymentTypes, {
	foreignKey: "employementTypeId",
	as: "employementTypeDetails"
});

// Project under taken experience reference
Models.UserProjectUndertakens.belongsTo(Models.EmploymentTypes, {
	foreignKey: "employementTypeId",
	as: "employementTypeDetails"
});


Models.UserProjectUndertakens.hasMany(Models.UserProjectLinks, {
	foreignKey: "projectId",
	as: "projectLinksDetails"
});


Models.UserProjectUndertakens.hasMany(Models.UserProjectTeamMembers, {
	foreignKey: "projectId",
	as: "projectTeamMembersDetails"
});

Models.UserProjectUndertakens.hasMany(Models.UserProjectDocuments, {
	foreignKey: "projectId",
	as: "projectDocumentsDetails"
});


// Job preferences reference
Models.UserJobPreferences.belongsTo(Models.EmploymentTypes, {
	foreignKey: "employementTypeId",
	as: "employementTypeDetails"
});
Models.UserJobPreferences.belongsTo(Models.Services, {
	foreignKey: "serviceId",
	as: "serviceDetails"
});

Models.UserJobPreferences.hasMany(Models.UserJobPreferencesIndustries, {
	foreignKey: "jobPreferenceId",
	as: "jobPreferenceIndustriesDetails"
});
Models.UserJobPreferences.hasMany(Models.UserJobPreferenceSecurityClearance, {
	foreignKey: "jobPreferenceId",
	as: "jobPreferenceSecurityClearanceDetails"
});

Models.UserJobPreferences.hasMany(Models.UserJobPreferenceTravelRequirements, {
	foreignKey: "jobPreferenceId",
	as: "jobPreferenceTravelRequirementsDetails"
});


Models.UserJobPreferences.hasMany(Models.UserJobPreferencesJobTitles, {
	foreignKey: "jobPreferenceId",
	as: "jobPreferenceJobTitleDetails"
});

Models.UserJobPreferences.hasMany(Models.UserJobPreferencesLocations, {
	foreignKey: "jobPreferenceId",
	as: "jobPreferenceLocationDetails"
});

Models.UserJobPreferenceSecurityClearance.belongsTo(Models.SecurityClearance, {
	foreignKey: "securityClearanceId",
	as: "securityClearanceDetails"
});

Models.UserJobPreferenceTravelRequirements.belongsTo(Models.TravelRequirements, {
	foreignKey: "travelRequirementId",
	as: "travelRequirementDetails"
});

Models.UserJobPreferencesIndustries.belongsTo(Models.Industries, {
	foreignKey: "industryId",
	as: "industryDetails"
});
Models.UserJobPreferencesJobTitles.belongsTo(Models.JobTitles, {
	foreignKey: "jobTitleId",
	as: "JobTitleDetails"
});

Models.UserJobPreferenceTravelRequirements.belongsTo(Models.TravelRequirements, {
	foreignKey: "travelRequirementId",
	as: "travelRequirementsDetails"
});


// Awards and honors experience reference

exports.getResume = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserEducations
			.findAll({
				where: where,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getResumeStatus = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserResumeStatus
			.findAll({
				where: where
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getUserTourOfDuties = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserTourOfDuties
			.findAll({
				where: where
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getByIdResumeStatus = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserResumeStatus
			.findOne({
				where: where
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.getUser = (criteria,projection) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		where.id= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.Users
			.findOne({
				where: where,
				attributes:projection
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.deleteRecords = (model,criteria) => {
	return new Promise((resolve, reject) => {
		model.destroy({where: criteria})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.getSkills = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserSkills
			.findAll({
				where: where,
				include: [
					{
						model: Models.Skills,
						as: "skillDetails",
						attributes: ["id", "name"],
						required: false
					}
				],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkEntriesForSkills = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({skillId: array[i],userId: criteria.userId});
	}
	return new Promise((resolve, reject) => {
		Models.UserSkills.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.saveUserBulkEntriesForSkills = (arrayToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserSkills.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveEducation = async (objToSave) => {
	return await baseService.saveData(Models.UserEducations, objToSave);
};

exports.updateEducation  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserEducations, criteria, objToSave);
};

exports.updateResumeStatus  = async (model,criteria, objToSave,) => {
	return await baseService.updateData(model, criteria, objToSave);
};

exports.saveResumeStatus = async (objToSave) => {
	return await baseService.saveData(Models.UserResumeStatus, objToSave);
};

exports.getEducation = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserEducations
			.findAll({
				where: where,
				include: [
					{
						model: Models.Universities,
						as: "universityDetails",
						attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.Specializations,
						as: "specializationDetails",
						attributes: ["id", "name"],
						required: false
					}
				],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveWorkExperience = async (objToSave) => {
	return await baseService.saveData(Models.UserWorkExperiences, objToSave);
};

exports.updateWorkExperience  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserWorkExperiences, criteria, objToSave);
};


exports.getWorkExperience = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserWorkExperiences
			.findAll({
				where: where,
				include: [
					{
						model: Models.EmploymentTypes,
						as: "employementTypeDetails",
						attributes: ["id", "name"],
						required: false
					}
				],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveVolunteerExperience = async (objToSave) => {
	return await baseService.saveData(Models.UserVolunteerExperiences, objToSave);
};

exports.updateVolunteerExperience  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserVolunteerExperiences, criteria, objToSave);
};


exports.getProjectTaken = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserProjectUndertakens
			.findAll({
				where: where,
				include: [
					{
						model: Models.EmploymentTypes,
						as: "employementTypeDetails",
						attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.UserProjectLinks,
						as: "projectLinksDetails",
						attributes: ["id", "link"],
						required: false
					},
					{
						model: Models.UserProjectDocuments,
						as: "projectDocumentsDetails",
						attributes: ["id", "name","fileName"],
						required: false
					},
					{
						model: Models.UserProjectTeamMembers,
						as: "projectTeamMembersDetails",
						attributes: ["id", "name","email"],
						required: false
					},
				],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveProjectTaken = async (objToSave) => {
	return await baseService.saveData(Models.UserProjectUndertakens, objToSave);
};

exports.updateProjectTaken  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserProjectUndertakens, criteria, objToSave);
};


exports.getVolunteerExperience = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserVolunteerExperiences
			.findAll({
				where: where,
				include: [
					{
						model: Models.EmploymentTypes,
						as: "employementTypeDetails",
						attributes: ["id", "name"],
						required: false
					}
				],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkEntriesForProjectMembers = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({name: array[i].name,email:array[i].email,userId: criteria.userId,projectId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserProjectTeamMembers.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkEntriesForProjectDocuments = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({name: array[i].name,fileName:array[i].fileName,userId: criteria.userId,projectId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserProjectDocuments.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkEntriesForProjectLinks = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({link: array[i],userId: criteria.userId,projectId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserProjectLinks.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.saveBulkEntriesForUserPreferenceIndustries = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({industryId: array[i],userId: criteria.userId,jobPreferenceId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserJobPreferencesIndustries.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.saveBulkObjEntriesForUserPreferenceIndustries = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserJobPreferencesIndustries.bulkCreate(objToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.saveBulkEntriesForUserPreferenceJobTitles = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({jobTitleId: array[i],userId: criteria.userId,jobPreferenceId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserJobPreferencesJobTitles.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkObjEntriesForUserPreferenceJobTitles = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserJobPreferencesJobTitles.bulkCreate(objToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.saveBulkEntriesForUserPreferenceLocations = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({location: array[i].location,zipCode: array[i].zipCode,latitude: array[i].latitude,longitude: array[i].longitude,userId: criteria.userId,jobPreferenceId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserJobPreferencesLocations.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkEntriesForUserTourOfDuties = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({location: array[i].location,zipCode: array[i].zipCode,latitude: array[i].latitude,longitude: array[i].longitude, fromDate: array[i].fromDate, toDate: array[i].toDate, userId: criteria.userId,jobPreferenceId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserTourOfDuties.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.saveBulkEntriesForUserSecurityClearance = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({securityClearanceId: array[i],userId: criteria.userId,jobPreferenceId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserJobPreferenceSecurityClearance.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkObjEntriesForUserSecurityClearance = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserJobPreferenceSecurityClearance.bulkCreate(objToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveBulkEntriesForUserTravelRequirements = (array,criteria) => {
	let arrayToSave = [];
	for (let i in array) {
		arrayToSave.push({travelRequirementId: array[i],userId: criteria.userId,jobPreferenceId: criteria.id});
	}
	return new Promise((resolve, reject) => {
		Models.UserJobPreferenceTravelRequirements.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.saveBulkEntriesForUserTravelRequirementsV1 = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserJobPreferenceTravelRequirements.bulkCreate(objToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveUserAwardsAndHonors = (arrayToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserAwardsAndHonors.bulkCreate(arrayToSave)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getUserJobPreferencesIndustries = (projection, criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria && criteria.isType === 0) {
			where.isType = criteria.isType;
		}
		if (criteria && criteria.isType === 1) {
			where.isType = criteria.isType;
		}
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;

		Models
			.UserJobPreferencesIndustries
			.findAll({
				where: where,
				order: order,
				attributes: projection,
				group: ["industryId"],
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getAwardsAndHonors = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria && criteria.isType === 0) {
			where.isType = criteria.isType;
		}
		if (criteria && criteria.isType === 1) {
			where.isType = criteria.isType;
		}
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;

		Models
			.UserAwardsAndHonors
			.findAll({
				where: where,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveAwardsAndHonors = async (objToSave) => {
	return await baseService.saveData(Models.UserAwardsAndHonors, objToSave);
};

exports.updateAwardsAndHonors  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserAwardsAndHonors, criteria, objToSave);
};

exports.saveJobPreference = async (objToSave) => {
	return await baseService.saveData(Models.UserJobPreferences, objToSave);
};

exports.updateJobPreference  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserJobPreferences, criteria, objToSave);
};


exports.getJobPreference = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserJobPreferences
			.findAll({
				where: where,
				include: [
					{
						model: Models.EmploymentTypes,
						as: "employementTypeDetails",
						attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.Services,
						as: "serviceDetails",
						attributes: ["id", "name"],
						required: false
					},
					
					{
						model: Models.UserJobPreferencesIndustries,
						as: "jobPreferenceIndustriesDetails",
						include: [
							{
								model: Models.Industries,
								as: "industryDetails",
								//attributes: ["id", "name"],
								required: false
							}
						],
						//attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.UserJobPreferenceSecurityClearance,
						as: "jobPreferenceSecurityClearanceDetails",
						include: [
							{
								model: Models.SecurityClearance,
								as: "securityClearanceDetails",
								//attributes: ["id", "name"],
								required: false
							}
						],
						//attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.UserJobPreferenceTravelRequirements,
						as: "jobPreferenceTravelRequirementsDetails",
						include: [
							{
								model: Models.TravelRequirements,
								as: "travelRequirementsDetails",
								//attributes: ["id", "name"],
								required: false
							}
						],
						//attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.UserJobPreferencesJobTitles,
						as: "jobPreferenceJobTitleDetails",
						include: [
							{
								model: Models.JobTitles,
								as: "JobTitleDetails",
								//attributes: ["id", "name"],
								required: false
							}
						],
						//attributes: ["id", "name"],
						required: false
					},
					{
						model: Models.UserJobPreferencesLocations,
						as: "jobPreferenceLocationDetails",
						attributes: ["id", "location","zipCode","latitude","longitude"],
						required: false
					},
					
				],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getLicenseAndCertification = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserLicensesCertifications
			.findAll({
				where: where,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveLicenseAndCertification = async (objToSave) => {
	return await baseService.saveData(Models.UserLicensesCertifications, objToSave);
};

exports.updateLicenseAndCertification  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserLicensesCertifications, criteria, objToSave);
};


exports.getLanguage = (criteria) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		where.userId= criteria.userId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.UserLanguages
			.findAll({
				where: where,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveLanguage = async (objToSave) => {
	return await baseService.saveData(Models.UserLanguages, objToSave);
};

exports.saveLanguageBulk = async (objToSave) => {
	return await baseService.saveBulkData(Models.UserLanguages, objToSave);
};

exports.updateLanguage  = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserLanguages, criteria, objToSave);
};

exports.saveSkills = async (objToSave) => {
	return await baseService.saveData(Models.UserSkills, objToSave);
};


