"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

//test
exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.SuccessStories, objToSave);
};
//test
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.SuccessStories, criteria, objToSave);
};
//test
exports.count = async (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				name: {
					[Op.like]: "%" + criteria.search + "%"
				},
				companyName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				designation: {
					[Op.like]: "%" + criteria.search + "%"
				},
			},
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.SuccessStories, where);
};

//test
exports.getOne = async (criteria, projection) => {
	return await baseService.getSingleRecord(Models.SuccessStories, criteria, projection);
};
//test
exports.getListing = (criteria,projection, limit, offset) => {
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
					name: {
						[Op.like]: "%" + criteria.search + "%"
					},
					companyName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					designation: {
						[Op.like]: "%" + criteria.search + "%"
					},
				},
			};
		}
		if(criteria && criteria.startDate && criteria.endDate) {
			let startDate = new Date(criteria.startDate);
			let endDate = new Date(criteria.endDate);
			startDate = new Date(startDate.setHours(0, 0, 0, 0));
			endDate = new Date(endDate.setHours(23, 59, 0, 0));
			where.createdAt = {
				[Op.and]: {
					[Op.gte]: startDate,
					[Op.lte]: endDate,
				},
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.SuccessStories
			.findAll({
				limit,
				offset,
				attributes: projection,
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
