"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");
var moment = require("moment");
const sequelize = require("../dbConnection").sequelize;

Models.RecruiterView.belongsTo(Models.Recruiter, {
	foreignKey: "recuiterId",
});

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.Schedules, objToSave);
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.Schedules, criteria, objToSave);
};

exports.count = async (model, criteria) => {
	let where = {};

	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
		//  where.isBlocked=0;
	}
	if(criteria && criteria.userId) {
		where.userId = criteria.userId;
	}
	if(criteria.actionType ===0){
		where.actionType=criteria.actionType;
	}
	if(criteria.actionType){
		where.actionType=criteria.actionType;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(model, where);
};

exports.getOne = async (criteria) => {
	return await baseService.getSingleRecord(Models.Schedules, criteria);
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
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.Schedules
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
			.Schedules
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

exports.getAllRecordsSearchCount = (model, criteria, projection, limit, offset) => {
	console.log(criteria,"baseService");
	return new Promise((resolve, reject) => {
		model
			.findAll({
				limit,
				offset,
				where: criteria,
				attributes: projection,
				group: ["title"]
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getWeekEarningChart_old = (criteria) => {
	// let startMonthEarning = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
	let startMonthEarning = moment().subtract(7,"d").format("YYYY-MM-DD HH:mm:ss");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT dayofweek(createdAt) AS dayOfWeek, IFNULL(count(id),0) as amount FROM recruiter_search_appearance WHERE recruiter_search_appearance.userId='${criteria.userId}' and recruiter_search_appearance.createdAt >= '${startMonthEarning}' AND recruiter_search_appearance.createdAt <= '${endMonthEarning}' GROUP BY dayOfWeek ORDER BY dayOfWeek;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getWeekEarningChart = (criteria) => {
	// let startMonthEarning = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(7,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT day(createdAt) AS dayOfWeek, DATE_FORMAT(createdAt,'%Y-%m-%d') as graphdate, IFNULL(count(id),0) as amount FROM recruiter_search_appearance WHERE recruiter_search_appearance.userId='${criteria.userId}' and recruiter_search_appearance.createdAt >= '${startMonthEarning}' AND recruiter_search_appearance.createdAt <= '${endMonthEarning}' GROUP BY dayOfWeek ORDER BY dayOfWeek;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getMonthEarningChart = (criteria) => {
	// let startMonthEarning = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(30,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT day(createdAt) AS day, DATE_FORMAT(createdAt,'%Y-%m-%d') as graphdate, IFNULL(count(id),0) as amount FROM recruiter_search_appearance WHERE recruiter_search_appearance.userId='${criteria.userId}' and recruiter_search_appearance.createdAt >= '${startMonthEarning}' AND recruiter_search_appearance.createdAt <= '${endMonthEarning}' GROUP BY day ORDER BY day;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getYearEarningChart = (criteria) => {
	// let startMonthEarning = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(90,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT day(createdAt) AS day, DATE_FORMAT(createdAt,'%Y-%m-%d') as graphdate, IFNULL(count(id),0) as amount FROM recruiter_search_appearance WHERE recruiter_search_appearance.userId='${criteria.userId}' and recruiter_search_appearance.createdAt >= '${startMonthEarning}' AND recruiter_search_appearance.createdAt <= '${endMonthEarning}' GROUP BY day ORDER BY day;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getYearEarningChart_old = (criteria) => {
	// let startMonthEarning = moment().startOf('year').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('year').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
	let startMonthEarning = moment().subtract(90,"d").format("YYYY-MM-DD HH:mm:ss");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT  month(createdAt) AS month, IFNULL(count(id),0) as amount FROM recruiter_search_appearance WHERE recruiter_search_appearance.userId='${criteria.userId}' and recruiter_search_appearance.createdAt >= '${startMonthEarning}' AND recruiter_search_appearance.createdAt <= '${endMonthEarning}' GROUP BY month ORDER BY month;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getWeekViewChart_Old = (criteria) => {
	// let startMonthEarning = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().add(1, "days").format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(7,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT dayofweek(createdAt) AS dayOfWeek, IFNULL(count(id),0) as amount FROM recruiter_view WHERE recruiter_view.userId='${criteria.userId}' and recruiter_view.createdAt >= '${startMonthEarning}' AND recruiter_view.createdAt <= '${endMonthEarning}' and actionType=0 GROUP BY dayOfWeek ORDER BY dayOfWeek;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getWeekViewChart = (criteria) => {
	// let startMonthEarning = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(7,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT day(createdAt) AS dayOfWeek, DATE_FORMAT(createdAt,'%Y-%m-%d') as graphdate, IFNULL(count(id),0) as amount FROM recruiter_view WHERE recruiter_view.userId='${criteria.userId}' and recruiter_view.createdAt >= '${startMonthEarning}' AND recruiter_view.createdAt <= '${endMonthEarning}' and actionType=0 GROUP BY dayOfWeek ORDER BY dayOfWeek;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getMonthViewChart = (criteria) => {
	// let startMonthEarning = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(30,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT day(createdAt) AS day, DATE_FORMAT(createdAt,'%Y-%m-%d') as graphdate, IFNULL(count(id),0) as amount FROM recruiter_view WHERE recruiter_view.userId='${criteria.userId}' and recruiter_view.createdAt >= '${startMonthEarning}' AND recruiter_view.createdAt <= '${endMonthEarning}' and actionType =0 GROUP BY day ORDER BY day;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getMonth90ViewChart = (criteria) => {
	// let startMonthEarning = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD");
	let startMonthEarning = moment().subtract(90,"d").format("YYYY-MM-DD");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT day(createdAt) AS day, DATE_FORMAT(createdAt,'%Y-%m-%d') as graphdate, IFNULL(count(id),0) as amount FROM recruiter_view WHERE recruiter_view.userId='${criteria.userId}' and recruiter_view.createdAt >= '${startMonthEarning}' AND recruiter_view.createdAt <= '${endMonthEarning}' and actionType =0 GROUP BY day ORDER BY day;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getYearViewChart = (criteria) => {
	// let startMonthEarning = moment().startOf('year').format("YYYY-MM-DD HH:mm:ss");
	// let endMonthEarning = moment().endOf('year').format("YYYY-MM-DD HH:mm:ss");
	let endMonthEarning = moment().format("YYYY-MM-DD HH:mm:ss");
	let startMonthEarning = moment().subtract(7,"d").format("YYYY-MM-DD HH:mm:ss");
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT  month(createdAt) AS month, IFNULL(count(id),0) as amount FROM recruiter_view WHERE recruiter_view.userId='${criteria.userId}' and recruiter_view.createdAt >= '${startMonthEarning}' AND recruiter_view.createdAt <= '${endMonthEarning}' and actionType=0 GROUP BY month ORDER BY month;`)
			.then(result => {
				resolve(result[0]);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.	getRecruiterViewList = (criteria, projection, limit, offset) => {
	let where={};
	let order = [
		["createdAt", "DESC"],
	];
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
		//  where.isBlocked=0;
	}
	if(criteria.userId){
		where.userId=criteria.userId;
	}
	if (criteria.sortBy && criteria.orderBy) {
		order = [
			[criteria.sortBy, criteria.orderBy],
		];
	}
	if(criteria.actionType ===0){
		where.actionType=criteria.actionType;
	}
	if(criteria.actionType){
		where.actionType=criteria.actionType;
	}
	if(criteria.isApproved){
		where.isApproved=criteria.isApproved;
	}
	if(criteria.isDeleted){
		where.isDeleted=criteria.isDeleted;
	}
	if(criteria.isBlocked){
		where.isBlocked=criteria.isBlocked;
	}
	return new Promise((resolve, reject) => {
		Models.RecruiterView.findAll({
			limit,
			offset,
			where: where,
			attributes: projection,
			include: [
				{
					model: Models.Recruiter,
					required: false
				}
			],
			order: order
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};

exports.countSearchAppperance = (criteria, startDate, endDate) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT IFNULL(count(id),0) as count FROM recruiter_search_appearance WHERE recruiter_search_appearance.userId='${criteria.userId}' and recruiter_search_appearance.createdAt >= '${endDate}' AND recruiter_search_appearance.createdAt <= '${startDate}'`)
			.then(result => {
				resolve(result[0][0].count);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.countUserView = (criteria, startDate, endDate) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		sequelize.query(`SELECT IFNULL(count(id),0) as count FROM recruiter_view WHERE recruiter_view.userId='${criteria.userId}' and recruiter_view.createdAt >= '${endDate}' AND recruiter_view.createdAt <= '${startDate}' and actionType=0`)
			.then(result => {
				resolve(result[0][0].count);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};