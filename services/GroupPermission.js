"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// const appConstants = require("../config/appConstants");
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

Models.RecruiterUsers.hasMany(Models.AssignUserGroup, {
	foreignKey: "recruiterUserId"
});



exports.getGroupPermission = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.GroupPermission
			.findOne({
				where: criteria,
				attributes: projection
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

exports.updateGroupPermission = async(criteria, objToSave) => {
	return await baseService.updateData(Models.GroupPermission, criteria, objToSave);

};

exports.deleteGroupPermission = async(criteria, objToSave) => {
	return await baseService.updateData(Models.AssignUserGroup, criteria, objToSave);

};



exports.getAllRecruiterUsers = (criteria, limit, offset) => {
	let where = {};
	let wheres ={};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	if(criteria && criteria.id) {
		where.groupPermissionId= criteria.id;
	}

	if (criteria && criteria.search) {
		wheres = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				fullName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	wheres.isDeleted = 0;
	wheres.isBlocked = 0;
	wheres.isArchive = 0;
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.select = 0;
	
	return new Promise((resolve, reject) => {
		Models.RecruiterUsers
			.findAll({
				limit,
				offset,
				where: wheres,
				order: order,
				include: [
					{
						model: Models.AssignUserGroup,
						where: where,
					}
				],
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.usersCount = async (criteria) => {
	let where = {};
	let wheres = {};
	if(criteria && criteria.id) {
		where.groupPermissionId= criteria.id;
	}
	if (criteria && criteria.search) {
		wheres = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				fullName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	wheres.isDeleted = 0;
	wheres.isBlocked = 0;
	wheres.isArchive = 0;
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.select = 0;
	return new Promise((resolve, reject) => {
		Models.RecruiterUsers
			.count({
				// limit,
				// offset,
				where: wheres,
				include: [
					{
						model: Models.AssignUserGroup,
						where: where,
					}
				],
				// order: order,
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.getAllGroupPermissions = (criteria, projection, limit, offset) => {
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
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				groupName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				groupDescription: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isActive"] === 1) where.isBlocked = 0;

	return new Promise((resolve, reject) => {
		Models.GroupPermission
			.findAll({
				limit,
				offset,
				where: where,
				attributes: projection,
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

exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				groupName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				groupDescription: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}

	where.isBlocked = 0;
	where.isDeleted = 0;
	return await baseService.count(Models.GroupPermission, where);
};
/**
 * #########    @function countAdmins         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count admin users #######
 */

exports.addGroup = async (objToSave) => {
	return await baseService.saveData(Models.GroupPermission, objToSave);	
};