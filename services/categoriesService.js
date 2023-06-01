"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

Models.SubCategories.belongsTo(Models.Categories, {
	foreignKey: "categoryId",
	as: "categoryDetails"
});

Models.Categories.hasMany(Models.SubCategories, {
	foreignKey: "categoryId",
	as: "categoryDetails"
});

exports.saveDataCategories = async (objToSave) => {
	return await baseService.saveData(Models.Categories, objToSave);
};

exports.saveDataSubCategories = async (objToSave) => {
	return await baseService.saveData(Models.SubCategories, objToSave);
};

exports.updateDataCategories = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.Categories, criteria, objToSave);
};

exports.updateDataSubCategories = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.SubCategories, criteria, objToSave);
};

exports.getOneCategories = async (criteria, projection) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let wheres ={};		
		where.isDeleted = 0;
		where.isBlocked = 0;
		wheres.isDeleted = 0;
		wheres.isBlocked = 0;
		where.id=criteria.id;
		Models
			.Categories
			.findOne({
				where: where,
				attributes: projection,
				include: [
					{
						model: Models.SubCategories,
						as: "categoryDetails",
						attributes: ["id", "name"],
						where:wheres,
						required: false
					}
				]
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


// exports.getOneSubCategories = async (criteria) => {
// 	return await baseService.getSingleRecord(Models.SubCategories, criteria);
// };

exports.countCategories = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.Categories, where);
};

exports.countSubCategories = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if(criteria&&criteria.categoryId){
		where.categoryId=criteria.categoryId;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.SubCategories, where);
};



exports.getListingCategories = (criteria, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};	
		let wheres={};	
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		wheres.isDeleted = 0;
		wheres.isBlocked = 0;
		Models
			.Categories
			.findAll({
				limit,
				offset,
				where: where,
				include: [
					{
						model: Models.SubCategories,
						as: "categoryDetails",
						where: wheres,
						//attributes: ["id", "name"],
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
exports.getCategories = (criteria,projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};	
		let wheres={};	
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		wheres.isDeleted = 0;
		wheres.isBlocked = 0;
		Models
			.Categories
			.findAll({
				limit,
				offset,
				attributes: projection,
				where: where,
				include: [
					{
						model: Models.SubCategories,
						as: "categoryDetails",
						where: wheres,
						//attributes: ["id", "name"],
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


exports.getListingSubCategories = (criteria, limit, offset) => {
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		if(criteria&&criteria.categoryId){
			where.categoryId=criteria.categoryId;
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.SubCategories
			.findAll({
				limit,
				offset,
				where: where,
				include: [
					{
						model: Models.Categories,
						as: "categoryDetails",
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

exports.getOneSubCategories = (criteria, limit, offset) => {
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.SubCategories
			.findOne({
				limit,
				offset,
				where: where,
				include: [
					{
						model: Models.Categories,
						as: "categoryDetails",
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