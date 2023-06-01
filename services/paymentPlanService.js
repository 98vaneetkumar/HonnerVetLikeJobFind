"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");
const moment = require("moment");

//test
exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.PaymentPlan, objToSave);
};
//test
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.PaymentPlan, criteria, objToSave);
};
//test
exports.count = async (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	if (criteria && criteria.search) {
		where = {
			planName: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if(criteria && criteria.expireSoonEndDate) {
		let startDate = new Date();
		let expireSoonEndDate = new Date(criteria.expireSoonEndDate);
		startDate = new Date(startDate.setHours(0, 0, 0, 0));
		expireSoonEndDate = new Date(expireSoonEndDate.setHours(23, 59, 0, 0));
		where.createdAt = {
			[Op.and]: {
				[Op.gte]: startDate,
				[Op.lte]: expireSoonEndDate,
			},
		};	

	}
	where.isDeleted = 0;
	where.planType = criteria.planType;
	return await baseService.count(Models.PaymentPlan, where);
};

//test
exports.getOne = async (criteria, projection) => {
	return await baseService.getSingleRecord(Models.PaymentPlan, criteria, projection);
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
				planName: {
					[Op.like]: "%" + criteria.search + "%"
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
		if(criteria && criteria.expireSoonEndDate) {
			let startDate = new Date();
			let expireSoonEndDate = new Date(criteria.expireSoonEndDate);
			startDate = new Date(startDate.setHours(0, 0, 0, 0));
			expireSoonEndDate = new Date(expireSoonEndDate.setHours(23, 59, 0, 0));
			where.createdAt = {
				[Op.and]: {
					[Op.gte]: startDate,
					[Op.lte]: expireSoonEndDate,
				},
			};	

		}
		
		where.isDeleted = 0;
		where.planType=criteria.planType;
		Models
			.PaymentPlan
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



//test
exports.subscriptionCount = async (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	if (criteria && criteria.search) {
		where = {
			planName: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if(criteria && criteria.expireSoonEndDate) {
		let startDate = new Date();
		let expireSoonEndDate = new Date(criteria.expireSoonEndDate);
		startDate = new Date(startDate.setHours(0, 0, 0, 0));
		expireSoonEndDate = new Date(expireSoonEndDate.setHours(23, 59, 0, 0));
		where.createdAt = {
			[Op.and]: {
				[Op.gte]: startDate,
				[Op.lte]: expireSoonEndDate,
			},
		};	

	}
	where.isDeleted = 0;
	where.planType =0;
	return await baseService.count(Models.RecruiterTransaction, where);
};

exports.inventoryCount = async (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	if (criteria && criteria.search) {
		where = {
			planName: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if(criteria && criteria.expireSoonEndDate) {
		let startDate = new Date();
		let expireSoonEndDate = new Date(criteria.expireSoonEndDate);
		startDate = new Date(startDate.setHours(0, 0, 0, 0));
		expireSoonEndDate = new Date(expireSoonEndDate.setHours(23, 59, 0, 0));
		where.createdAt = {
			[Op.and]: {
				[Op.gte]: startDate,
				[Op.lte]: expireSoonEndDate,
			},
		};	

	}
	where.isDeleted = 0;
	where.planType =1;
	return await baseService.count(Models.RecruiterTransaction, where);
};

exports.get_today_user = (criteria) => {
	let start = moment().toDate();
	start = start.setHours(0, 0, 0, 0);
	let end = moment().toDate();
	end = end.setHours(23, 59, 59, 999);
	let where = {};
	where = {
		[Op.and]: [{
			createdAt: {
				[Op.between]: [start, end]
			}
		},]
	};
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
	} 
	where.isDeleted = "0";
	where.planType=criteria.planType;
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction.count({
			attributes: [
				[Sequelize.fn("day", Sequelize.col("createdAt")), "day"],
				[Sequelize.fn("count", Sequelize.col("id")), "totalCount"]
			],
			where:where,
			group: [Sequelize.fn("DAY", Sequelize.col("createdAt"))]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ",err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.get_weekly_user = (criteria) => {
	let start = moment().startOf("week").toDate();
	start = start.setHours(0, 0, 0, 0);
	let end = moment().endOf("week").toDate();
	end = end.setHours(23, 59, 59, 999);

	let where = {};
	where = {
		[Op.and]: [{
			createdAt: {
				[Op.between]: [start, end]
			}
		},]
	};
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
	} 
	where.isDeleted = "0";
	where.planType=criteria.planType;
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction.count({ 
			attributes: [
				[Sequelize.fn("dayofweek", Sequelize.col("createdAt")), "day"],
				[Sequelize.fn("count", Sequelize.col("id")), "totalCount"]
			],
			where:where,
			group: [Sequelize.fn("dayofweek", Sequelize.col("createdAt"))]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ",err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.get_monthly_user = (criteria) => {
	let start = moment().startOf("month").toDate();
	start = start.setHours(0, 0, 0, 0);
	let end = moment().endOf("month").toDate();
	end = end.setHours(23, 59, 59, 999);

	let where = {};
	where = {
		[Op.and]: [{
			createdAt: {
				[Op.between]: [start, end]
			}
		},]
	};
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
	} 
	where.isDeleted = "0";
	where.planType= criteria.planType;
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction.count({ attributes: [
			[Sequelize.fn("DAY", Sequelize.col("createdAt")), "day"],
			[Sequelize.fn("count", Sequelize.col("id")), "totalCount"]
		],
		where:where,
		group: [Sequelize.fn("DAY", Sequelize.col("createdAt"))]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ",err);
				reject(Response.error_msg.implementationError);
			});
	});
};


exports.get_yearly_user = (criteria) => {
	let year = ((new Date()).getFullYear() - 1);
	let where = {};
	where = Sequelize.and(Sequelize.where(Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y"), moment().format("YYYY")),
		year);
	if (criteria && criteria.yearByData) {
		year =  ((new Date(criteria.yearByData)).getFullYear() - 1);
		where = Sequelize.and(Sequelize.where(Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y"), criteria.yearByData),
		year);
	}
	console.log(year, "year")
	
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
	} 
	where.isDeleted = "0";
	where.planType=criteria.planType;
	console.log(where, "where")
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction.count({ attributes: [
			[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
			[Sequelize.fn("count", Sequelize.col("id")), "totalCount"]
		],
		where:where,
		group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))]

		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ",err);
				reject(Response.error_msg.implementationError);
			});
	});
};