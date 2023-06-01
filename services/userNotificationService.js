"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.Notification, objToSave);
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.Notification, criteria, objToSave);
};
exports.hardDelete = async (criteria) => {
	return await baseService.delete(Models.Notification, criteria);
};

exports.saveDataRecruiter = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterNotification, objToSave);
};
exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if (criteria && criteria.userId) {
		where.userId = criteria.userId;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.Notification, where);
};

exports.unreadCount = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if (criteria && criteria.userId) {
		where.userId = criteria.userId;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.isRead=0;
	return await baseService.count(Models.Notification, where);
};

exports.getOne = async (criteria,projection) => {
	return await baseService.getSingleRecord(Models.Notification, criteria,projection);
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
				},
				message: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		if (criteria && criteria.userId) {
			where.userId = criteria.userId;
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.Notification
			.findAll({
				limit,
				offset,
				attributes:projection,
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
			.Notification
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