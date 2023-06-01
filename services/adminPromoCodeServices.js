
"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.AdminPromoCode, objToSave);
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.AdminPromoCode, criteria, objToSave);
};

exports.getOne = async (criteria, projection) => {
	return await baseService.getSingleRecord(Models.AdminPromoCode, criteria, projection);
};

exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				name: {
					[Op.like]: "%" + criteria.search + "%"
				},
				code: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	if(criteria && criteria.startDate && criteria.expiryDate) {
		let startDate = new Date(criteria.startDate);
		let expiryDate = new Date(criteria.expiryDate);
		startDate = new Date(startDate.setHours(0, 0, 0, 0));
		expiryDate = new Date(expiryDate.setHours(23, 59, 0, 0));
		where.createdAt = {
			[Op.and]: {
				[Op.gte]: startDate,
				[Op.lte]: expiryDate,
			},
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	if (criteria && criteria.promoType === 1) where.promoType = 1;
	if (criteria && criteria.promoType === 0) where.promoType = 0;
	return await baseService.count(Models.AdminPromoCode, where);
};

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
					id: {
						[Op.like]: "%" + criteria.search + "%"
					},
					name: {
						[Op.like]: "%" + criteria.search + "%"
					},
					code: {
						[Op.like]: "%" + criteria.search + "%"
					}
				}
			};
		} 
		if(criteria && criteria.startDate && criteria.expiryDate) {
			let startDate = new Date(criteria.startDate);
			let expiryDate = new Date(criteria.expiryDate);
			startDate = new Date(startDate.setHours(0, 0, 0, 0));
			expiryDate = new Date(expiryDate.setHours(23, 59, 0, 0));
			where.createdAt = {
				[Op.and]: {
					[Op.gte]: startDate,
					[Op.lte]: expiryDate,
				},
			};
		}
		
		where.isDeleted = 0;
		where.isBlocked = 0;
		if (criteria && criteria.promoType === 1) where.promoType = 1;
		if (criteria && criteria.promoType === 0) where.promoType = 0;
		Models
			.AdminPromoCode
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



