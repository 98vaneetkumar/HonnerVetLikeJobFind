"use strict";
// const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const appConstants = require("../config/appConstants");
//const baseService = require("./base");


/**
 * ######### @function getDetail ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve users ########
 */

Models.Recruiter.hasOne(Models.GroupPermission);
var RecruiterUser = {
	model: Models.GroupPermission,
	attributes: [...appConstants.APP_CONSTANTS.PERMISSION_MODULES],
	required: false
};

exports.getDetail = (criteria, projection) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	criteria.isDeleted=0;
	return new Promise((resolve, reject) => {
		Models.Recruiter.findOne({ 
				where: criteria,
				attributes: projection
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.getUserType = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.Recruiter
			.findOne({
				where: criteria,
				attributes: projection,
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = [["id", "DESC"]];
		Models.Recruiter.findAll({
			limit,
			offset,
			where: criteria,
			attributes: projection,
			order: order
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};

exports.getAllBillingAddress = (criteria, Projection1) => {
	return new Promise((resolve, reject) => {
		Models.BillingAddress.findOne({
			where: criteria,
			attributes: Projection1
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};


/**
 * ######### @function saveData ########
 * ######### @params => criteria, user data ########
 * ######### @logic => Used to create users ########
 */
exports.saveData = (data) => {
	return new Promise((resolve, reject) => {
		Models.Recruiter.create(data)
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

/**
 * ######### @function updateData ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update users ########
 */
exports.updateData = (criteria, objToSave) => {
	return new Promise((resolve, reject) => {
		Models.Recruiter.update(objToSave, { where: criteria })
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

/**
 * #########    @function count         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count users #######
 */
exports.count = (criteria) => {
	let where = criteria;
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

/**
 * ######### @function delete                               ########
 * ######### @params => criteria                            ########
 * ######### @logic => Used to delete user delete      ########
 */
exports.deleteUserDelete = (criteria) => {
	return new Promise((resolve, reject) => {
		Models.Recruiter.destroy({
			where: criteria
		})
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err); reject(Response.error_msg.implementationError);
			});
	});
};


exports.getAllRecruiter = (criteria, projection, limit, offset) => {
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	where.isDeleted = 0;
	
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	
	return new Promise((resolve, reject) => {
		Models.Recruiter
			.findAndCountAll({
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


exports.getRecruiterById = (criteria, projectionDetail) => {
	return new Promise((resolve, reject) => {
		Models.Recruiter
			.findOne({
				where: criteria,
				attributes: projectionDetail,
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

exports.getAllAPPRecruiter = (data,criteria, projection, limit, offset) => {
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
				companyName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				industry: {
					[Op.like]: "%" + criteria.search + "%"
				},
				location: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	}
	where.isDeleted = 0;
	
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isAdminApproved"] === "1") where.isAdminApproved = "1";
	if (data["userType"]) where.userType = data.userType;

	return new Promise((resolve, reject) => {
		Models.Recruiter
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

/**
 * #########    @function count         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count users #######
 */
exports.countApp = (data,criteria) => {
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
				name: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
				companyName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				industry: {
					[Op.like]: "%" + criteria.search + "%"
				},
				location: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	}
	where.isDeleted = 0;
	
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isAdminApproved"] === "1") where.isAdminApproved = "1";
	if (data["userType"]) where.userType = data.userType;
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			order:order
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};