"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.NotificationMessage, objToSave);
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.NotificationMessage, criteria, objToSave);
};

exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			title: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	if(criteria && criteria.userType) {
		where.userType = criteria.userType;
	}
	return await baseService.count(Models.NotificationMessage, where);
};

exports.getOne = async (criteria, projection) => {
	return await baseService.getSingleRecord(Models.NotificationMessage, criteria, projection);
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
				title: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;

		if(criteria && criteria.userType) {
			where.userType = criteria.userType;
		}
		Models
			.NotificationMessage
			.findAll({
				limit,
				offset,
				where: where,
				attributes:projection,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getAllSearchListing = (criteria) => {
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
			.NotificationMessage
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