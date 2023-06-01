"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

Models.Users.hasMany(Models.FavouriteCandidate, { foreignKey: "userId" });

Models.FavouriteCandidate.belongsTo(Models.Users, { foreignKey: "userId" });
Models.Users.hasMany(Models.UserWorkExperiences, { foreignKey: "userId" });

Models.FavouriteCandidate.belongsTo(Models.Recruiter, { foreignKey: "recuriterId" });
Models.SuggestedHide.belongsTo(Models.Users, { foreignKey: "userId" });
Models.FavouriteCandidate.belongsTo(Models.Recruiter, { foreignKey: "recuriterId" });

exports.saveBulkData = async (objToSave) => {
	return await baseService.saveBulkData(Models.FavouriteCandidate, objToSave);
};
//use
exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.FavouriteCandidate, objToSave);
};

//save recruiter view detail

exports.saveRecruiterView = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterView, objToSave);
};

exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.FavouriteCandidate, criteria, objToSave);
};

exports.delete = async (criteria) => {
	return await baseService.delete(Models.FavouriteCandidate, criteria);
};

exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.userId) {
		where.userId = criteria.userId;
	}
	if (criteria && criteria.jobPostId) {
		where.jobPostId = criteria.jobPostId;
	}
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				userId: {
					[Op.in]: Sequelize.literal(`(SELECT users.id FROM users inner join user_work_experiences on users.id= user_work_experiences.userId  WHERE user_work_experiences.jobTitle LIKE "%${criteria.search}%" or users.name like "%${criteria.search}%" or user_work_experiences.companyName LIKE "%${criteria.search}%")`)
				},
			}
		};
	} 
	where.isDeleted = 0;
	where.recuriterId=criteria.recuriterId;
	where.isBlocked = 0;
	where.favourite=1;
	// if (criteria && criteria.favourite === 1) where.favourite = 1;
	// if (criteria && criteria.favourite === 0) where.favourite = 0;
	return await baseService.count(Models.FavouriteCandidate, where);
};

//use
exports.getListing = (criteria, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					userId: {
						[Op.in]: Sequelize.literal(`(SELECT users.id FROM users inner join user_work_experiences on users.id= user_work_experiences.userId  WHERE user_work_experiences.jobTitle LIKE "%${criteria.search}%" or users.name like "%${criteria.search}%" or user_work_experiences.companyName LIKE "%${criteria.search}%")`)
					},
				}
			};
		} 
		if (criteria.sortBy && criteria.orderBy) {
			order = [
				[criteria.sortBy, criteria.orderBy]
			];
		}
		where.isDeleted = 0;
		where.isBlocked=0;
		where.recuriterId=criteria.recuriterId;
		where.favourite = 1;
		// if (criteria && criteria.favourite === 1) where.favourite = 1;
		// if (criteria && criteria.favourite === 0) where.favourite = 0;
		Models
			.FavouriteCandidate 
			.findAll({
				limit,
				offset,
				where: where,
				include:[
					{
						model: Models.Users,
						attributes:["id","name","email","profileImage"],
						required:false,
						include:[
							{
								model: Models.UserWorkExperiences,
								attributes:["id","fromDate","toDate","jobTitle","companyName","location"],
								required:false,
							}],
					}],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

//use
exports.getOneFavourite = (criteria) => {
	return new Promise((resolve, reject) => {
		Models
			.FavouriteCandidate
			.findOne({
				where: criteria,
				include:[
					{
						model: Models.Users,
						attributes:["id","name","email"],
						required:false,
					}],
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


//This is for save job
exports.saveSkipped = async (objToSave) => {
	return await baseService.saveData(Models.SuggestedHide, objToSave);
};
//use
exports.updateJob = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.SuggestedHide, criteria, objToSave);
};
//use
exports.countJob = async (criteria) => {
	let where = {};
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.recruiterId=criteria.recuriterId;
	return await baseService.count(Models.SuggestedHide, where);
};

//use
exports.getOneSkipped = (criteria) => {
	return new Promise((resolve, reject) => {
		Models
			.SuggestedHide
			.findOne({
				where: criteria,
				include:[
					{
						model: Models.Users,
						attributes:["id","name","email"],
						required:false,
					}],
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
//use
exports.getListingSkipped = (criteria, limit, offset) => {
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
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					userId: {
						[Op.in]: Sequelize.literal(`(SELECT users.id FROM users inner join user_work_experiences on users.id= user_work_experiences.userId  WHERE user_work_experiences.jobTitle LIKE "%${criteria.search}%" or users.name like "%${criteria.search}%" or user_work_experiences.companyName LIKE "%${criteria.search}%")`)
					},
				}
			};
		} 
		where.recruiterId=criteria.recuriterId;
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.SuggestedHide
			.findAll({
				limit,
				offset,
				where: where,
				include:[
					{
						model: Models.Users,
						attributes:["id","name","email","profileImage"],
						required:false,
						include:[
							{
								model: Models.UserWorkExperiences,
								attributes:["id","fromDate","toDate","jobTitle","companyName","location"],
								required:false,
							}],
					}],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.deletes = async (criteria) => {
	return await baseService.delete(Models.SuggestedHide, criteria);
};