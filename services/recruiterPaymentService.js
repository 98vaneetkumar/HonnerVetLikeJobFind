"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveBulkData = async (objToSave) => {
	return await baseService.saveBulkData(Models.RecruiterCard, objToSave);
};

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterCard, objToSave);
};

exports.saveTransactionData = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterTransaction, objToSave);
};
exports.saveRecruiterCancelSubscription = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterCancelSubscription, objToSave);
};
exports.saveStripCustomerData = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterStripCustomer, objToSave);
};

exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.RecruiterCard, criteria, objToSave);
};
exports.updateTransactionData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.RecruiterTransaction, criteria, objToSave);
};

exports.delete = async (criteria) => {
	return await baseService.delete(Models.RecruiterCard, criteria);
};

exports.count = async () => {
	let where = {};
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.RecruiterCard, where);
};

exports.counts = async (criteria) => {
	let where = {};
	where.id=criteria.id;
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.RecruiterCard, where);
};

exports.getOne = async (criteria) => {
	return await baseService.getSingleRecord(Models.RecruiterCard, criteria);
};
exports.getRecruiterTransaction = async (criteria) => {
	return await baseService.getSingleRecord(Models.RecruiterTransaction, criteria);
};

exports.getStripCustomerOne = async (criteria) => {
	return await baseService.getSingleRecord(Models.RecruiterStripCustomer, criteria);
};

exports.getAllDetail = (criteria,projection) => {
	return new Promise((resolve, reject) => {
		
		Models
			.RecruiterCard
			.findAll({
				where: criteria,
				attributes:projection,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getListing = (criteria, limit, offset) => {
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
		if (criteria && criteria.recruiterId) {
			where.recruiterId = criteria.recruiterId;
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.RecruiterCard
			.findAll({
				limit,
				offset,
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
// Recruiter Transaction Listing 

exports.countTransaction = async (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				planName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				recruiterId: {
					[Op.in]: Sequelize.literal(	`(SELECT id FROM recruiter WHERE name LIKE "%${criteria.search }%")`
					)
				}
			}
		};
	}
	if (criteria && criteria.recruiterId) {
		where.recruiterId = criteria.recruiterId;
	}
	if (criteria && criteria.planType == 0) {
		where.planType = criteria.planType;
	}
	if (criteria && criteria.planType ===1) {
		where.planType = criteria.planType;
	}
	if (criteria && criteria.isSubscription) {
		where.isSubscription = 1;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.RecruiterTransaction, where);
};



exports.getListingTransaction = (criteria,projection, limit, offset) => {
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
					planName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					recruiterId: {
						[Op.in]: Sequelize.literal(	`(SELECT id FROM recruiter WHERE name LIKE "%${criteria.search }%")`
						)
					}
				}
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
		if (criteria && criteria.recruiterId) {
			where.recruiterId = criteria.recruiterId;
		}
		if (criteria && criteria.planType ===0) {
			where.planType = criteria.planType;
		}
		if (criteria && criteria.planType ===1) {
			where.planType = criteria.planType;
		}
		if (criteria && criteria.isSubscription) {
			where.isSubscription = 1;
		}
		
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.RecruiterTransaction
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



exports.subscriptionTransaction = () => {
	// [Sequelize.fn("sum", Sequelize.col("planAmount")), "subscriptionAmount"]
	let projection = ["planAmount", [Sequelize.literal("(SELECT TRUNCATE(SUM(planAmount- (planAmount*discount/100)),2))"), "subscriptionAmount"]];
	return new Promise((resolve, reject) => {
		let where = {};			
		where.isDeleted = 0;
		where.isBlocked = 0;
		where.planType = 0;
		Models
			.RecruiterTransaction
			.findOne({
				attributes: projection,
				where: where,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.inventoryTransaction = () => {
	let projection = ["planAmount", [Sequelize.literal("(SELECT TRUNCATE(SUM(planAmount- (planAmount*discount/100)),2))"), "inventoryAmount"]]
	return new Promise((resolve, reject) => {
		let where = {};			
		where.isDeleted = 0;
		where.isBlocked = 0;
		where.planType = 1;
		Models
			.RecruiterTransaction
			.findOne({
				attributes: projection,
				where: where,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.totalTransaction = () => {
	let projection = ["planAmount", [Sequelize.literal("(SELECT TRUNCATE(SUM(planAmount- (planAmount*discount/100)),2))"), "totalAmount"]]
	return new Promise((resolve, reject) => {
		let where = {};			
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.RecruiterTransaction
			.findOne({
				attributes: projection,
				where: where,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.getListingTransactionDetail = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction
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

exports.getPaymentUserListing = (criteria,projection, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	if(criteria && criteria.id) {
		where.planId= criteria.id;
	}

	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				recruiterId: {
					[Op.in]: Sequelize.literal(`(SELECT id FROM recruiter WHERE name LIKE "%${criteria.search}%")`)
				}
			}
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction
			.findAll({
				limit,
				offset,
				attributes: projection,
				where: where,
				order: order
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.paymentUsersCount = async (criteria) => {
	let where = {};
	if(criteria && criteria.id) {
		where.planId= criteria.id;
	}
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				recruiterId: {
					[Op.in]: Sequelize.literal(`(SELECT id FROM recruiter WHERE name LIKE "%${criteria.search}%")`)
				}
			}
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction
			.count({
				where: where
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};