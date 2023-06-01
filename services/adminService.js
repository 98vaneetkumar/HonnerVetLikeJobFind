"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const appConstants = require("../config/appConstants");
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");
Models.Admins.hasMany(Models.AdminPermissions);
var AdminPermissions = {
	model: Models.AdminPermissions,
	attributes: [...appConstants.APP_CONSTANTS.ADMIN_MODULES, "id", "isBlocked"],
	required: false
};

exports.getAdmin = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.Admins
			.findOne({
				where: criteria,
				attributes: projection,
				include: [AdminPermissions],
			})
			.then(result => {
				//console.log("result--------", result);
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.updateAdmins = async(criteria, objToSave) => {
	return await baseService.updateData(Models.Admins, criteria, objToSave);

};


exports.getAllAdmins = (criteria, projection, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				firstName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				lastName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	if (criteria && criteria.adminType) {
		where.adminType = criteria.adminType;
	}
	if (criteria && criteria.adminId) {
		where.id = {
			[Op.notIn]: [criteria.adminId]
		};
	}
	where.isDeleted = 0;
	
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isActive"] === 1) where.isBlocked = 0;
	let adminPermissions = {...AdminPermissions };
	if (criteria.accessPermissions) {
		let whereCondition = {};
		let modules = criteria.accessPermissions.split(",");
		modules.forEach((module) => {
			whereCondition[module] = 1;
		});
		adminPermissions.where = whereCondition;
	}
	return new Promise((resolve, reject) => {
		Models.Admins
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				include: [adminPermissions],
				order: order,
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
/**
 * #########    @function countAdmins         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count admin users #######
 */
exports.countAdmins = (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				firstName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				lastName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isActive"] === 1) where.isBlocked = 0;
	where.isDeleted = 0;
	
	if (criteria.accessPermissions) {
		AdminPermissions.where = {};
		if (criteria.accessPermissions) {
			AdminPermissions.where = {};
			criteria.accessPermissions.hasOwnProperty.call(() => {
				AdminPermissions.where.dashboard = 1;
			}, "dashboard");
		}
	}
	where.isDeleted = 0;
	
	return new Promise((resolve, reject) => {
		Models.Admins.count({
			where: where,
			include: [AdminPermissions]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.addAdmin = async (objToSave) => {
	return await baseService.saveData(Models.Admins, objToSave);	
};