"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const appConstants = require("../config/appConstants");
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");
Models.RecruiterUsers.hasMany(Models.Permission);
var Permission = {
	model: Models.Permission,
	attributes: [...appConstants.APP_CONSTANTS.PERMISSION_MODULES, "id", "isBlocked"],
	required: false
};

Models.RecruiterUsers.hasMany(Models.AssignUserGroup, {
	foreignKey: "recruiterUserId",
});

Models.AssignUserGroup.belongsTo(Models.GroupPermission, {
	foreignKey: "groupPermissionId",
});


exports.getRecruiterUsers = (criteria, projection) => {
	let where ={};
	where.select = 0;
	where.isDeleted = 0;
	where.isBlocked = 0;
	return new Promise((resolve, reject) => {
		Models.RecruiterUsers
			.findOne({
				where: criteria,
				attributes: projection,
				include:[
					{
						model: Models.Permission,required:false,
					},
					{
						model: Models.AssignUserGroup,required:false,
						where:where,
						include:{
							model:Models.GroupPermission, required:false,
							attributes:["groupName","id"]

						}}
				],
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.updateRecruiterUsers = async(criteria, objToSave) => {
	return await baseService.updateData(Models.RecruiterUsers, criteria, objToSave);
};

exports.getAllRecruiterUsers = (criteria, projection, limit, offset) => {
	let where = {};
	let wheres ={};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				fullName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
				phoneNumber: {
					[Op.like]: "%" + criteria.search + "%"
				},
				recruiterId: {
					[Op.in]: Sequelize.literal(`(SELECT id FROM recruiter WHERE name LIKE "%${criteria.search}%")`)
				},
				id: {
					[Op.or]:{
						[Op.in]: Sequelize.literal(`(SELECT recruiterUserId FROM assign_user_group as assign_user_group  Inner join group_permissions as group_permissions on group_permissions.id=assign_user_group.groupPermissionId
					where group_permissions.groupName LIKE "%${criteria.search}%" AND assign_user_group.isDeleted = 0 AND assign_user_group.select =0)`),
						[Op.like]: "%" + criteria.search + "%",
					}
				}
			}
		};
	}  
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	wheres.isDeleted = 0;
	wheres.isBlocked = 0;
	wheres.select = 0;
	if (criteria && criteria.isArchive === 1) where.isArchive = 1;
	if (criteria && criteria.isArchive === 0) where.isArchive = 0;

	let permissions = {...Permission };
	if (criteria.groupPermissions) {
		let whereCondition = {};
		let modules = criteria.groupPermissions.split(",");
		modules.forEach((module) => {
			whereCondition[module] = 1;
		});
		permissions.where = whereCondition;
	}
	return new Promise((resolve, reject) => {
		Models.RecruiterUsers
			.findAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				include:[
					{
						model: Models.Permission,required:false,
					},
					{
						model: Models.AssignUserGroup,required:false,
						where: wheres,
						include:{
							model:Models.GroupPermission, required:false,
							attributes:["groupName","id"]
						}}
				],
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
				fullName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
				phoneNumber: {
					[Op.like]: "%" + criteria.search + "%"
				},
				recruiterId: {
					[Op.in]: Sequelize.literal(`(SELECT id FROM recruiter WHERE name LIKE "%${criteria.search}%")`)
				},
				id: {
					[Op.or]:{
						[Op.in]: Sequelize.literal(`(SELECT recruiterUserId FROM assign_user_group as assign_user_group  Inner join group_permissions as group_permissions on group_permissions.id=assign_user_group.groupPermissionId
					where groupName LIKE "%${criteria.search}%" AND assign_user_group.isDeleted = 0 AND assign_user_group.select =0)`),
						[Op.like]: "%" + criteria.search + "%",
					}
				}
			}
		};
	}  
	where.isBlocked = 0;
	where.isDeleted = 0;
	if (criteria && criteria.isArchive === 1) where.isArchive = 1;
	if (criteria && criteria.isArchive === 0) where.isArchive = 0;
	return await baseService.count(Models.RecruiterUsers, where);
};
/**
 * #########    @function countAdmins         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count admin users #######
 */

exports.addRecruiterUsers = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterUsers, objToSave);	
};