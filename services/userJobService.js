"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveBulkData = async (objToSave) => {
	return await baseService.saveBulkData(Models.UserScreeningQuestion, objToSave);
};

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.UserJobApply, objToSave);
};

exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserJobApply, criteria, objToSave);
};

exports.hardDelete = async (criteria) => {
	return await baseService.delete(Models.UserJobApply, criteria);
};

exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			planName: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if (criteria && criteria.userId) {
		where.userId = criteria.userId;
	}
	if (criteria && criteria.jobPostId) {
		where.jobPostId = criteria.jobPostId;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.UserJobApply, where);
};

exports.counts = async (criteria) => {
	let where = {};
	where.id=criteria.id;
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.UserJobApply, where);
};

exports.getOne = async (criteria) => {
	return await baseService.getSingleRecord(Models.UserJobApply, criteria);
};

Models.UserJobApply.belongsTo(Models.JobPosts, {
	foreignKey: "jobPostId",
});

Models.JobPosts.belongsTo(Models.Recruiter, {
	foreignKey: "recuiterId",
});

Models.UserSavePostJob.belongsTo(Models.JobPosts, {
	foreignKey: "jobPostId",
});
exports.getListing = (criteria,projection1,projection2, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria.sortBy && criteria.orderBy) {
			order = [
				[criteria.sortBy, criteria.orderBy]
			];
		}
		where.isDeleted = 0;
		where.userId=criteria.userId;
		Models
			.UserJobApply
			.findAll({
				limit,
				offset,
				where: where,
				include: [
					{
						model: Models.JobPosts,
						attributes:projection1,
						required:  true,
						include:[
							{
								model: Models.EmploymentTypes,required:false,
								attributes:["id","name"],
							},
							{
								model: Models.Recruiter,required:false,
								attributes:projection2,
							}
						],
						// include: [
						// 	{
						// 		model: Models.Recruiter,
						// 		attributes:projection2,
						// 		required: true
						// 	}
						// ]
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

Models.UserJobApply.hasMany(Models.UserScreeningQuestion, {
	foreignKey: "jobApplyId",
});

exports.getAllRecords = (criteria,projection) => {
	console.log("===================",projection);
	return new Promise((resolve, reject) => {
		
		Models
			.UserJobApply
			.findOne({
				where: criteria,
				attributes:projection,
				include: [
					{
						model: Models.UserScreeningQuestion,
						attributes:["id","responseType","answer"],
						required: false
					}
				],
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


//This is for save job
exports.saveJob = async (objToSave) => {
	return await baseService.saveData(Models.UserSavePostJob, objToSave);
};
exports.updateJob = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.UserSavePostJob, criteria, objToSave);
};

exports.deleteSaveJob = async (criteria) => {
	return await baseService.delete(Models.UserSavePostJob, criteria);
};

exports.countJobApp = async (criteria) => {
	return await baseService.count(Models.UserSavePostJob, criteria);
};

exports.countJob = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			planName: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	where.userId=criteria.userId;
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.UserSavePostJob, where);
};

exports.countsJob = async (criteria) => {
	let where = {};
	where.id=criteria.id;
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.UserSavePostJob, where);
};

exports.getOneJob = async (criteria) => {
	return await baseService.getSingleRecord(Models.UserSavePostJob, criteria);
};

exports.getListingJob = (criteria,projection1,projection2, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria.sortBy && criteria.orderBy) {
			order = [
				[criteria.sortBy, criteria.orderBy]
			];
		}
		where.userId=criteria.userId;
		where.isDeleted = 0;
		Models
			.UserSavePostJob
			.findAll({
				limit,
				offset,
				where: where,
				include: [
					{
						model: Models.JobPosts,
						attributes:projection1,
						required:  true,
						include: [
							{
								model: Models.EmploymentTypes,required:false,
								attributes:["id","name"],
							},
							{
								model: Models.Recruiter,
								attributes:projection2,
								required: true
							}
						]
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


exports.getAllDetail = (criteria,projection) => {
	return new Promise((resolve, reject) => {
		
		Models
			.UserJobApply
			.findAll({
				where: criteria,
				attributes:projection,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
