"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const moment = require("moment");

Models.Users.hasMany(Models.UserSkills, {
	foreignKey: "userId",
	as: "userSkills",
	constraints: false,
});
Models.Users.hasMany(Models.UserEducations, {
	foreignKey: "userId",
	as: "userEducations",
	constraints: false,
});
Models.Users.hasMany(Models.UserWorkExperiences, {
	foreignKey: "userId",
	as: "userWorkExperiences",
	constraints: false,
});
Models.Users.hasMany(Models.UserVolunteerExperiences, {
	foreignKey: "userId",
	as: "userVolunteerExperiences",
	constraints: false,
});
Models.Users.hasMany(Models.UserProjectUndertakens, {
	foreignKey: "userId",
	as: "userProjectUndertakens",
	constraints: false,
});
Models.Users.hasMany(Models.UserProjectTeamMembers, {
	foreignKey: "userId",
	as: "userProjectTeamMembers",
	constraints: false,
});



/**
 * ######### @function getDetail ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve users ########
 */

exports.getUserDetail = (criteria, projection) => {
	if ("notInId" in criteria) {
		criteria.userId != criteria.notInId;
		delete criteria.notInId;
	}
	let data={
		id:criteria.userId
	};
	return new Promise((resolve, reject) => {
		Models.Users.findOne({ where: data,
			attributes: projection,
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};



exports.getList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = [["id", "DESC"]];
		Models.Users.findAll({
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

/**
 * ######### @function saveData ########
 * ######### @params => criteria, user data ########
 * ######### @logic => Used to create users ########
 */
exports.saveData = (data) => {
	return new Promise((resolve, reject) => {
		Models.Users.create(data)
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
		Models.Users.update(objToSave, { where: criteria })
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
		Models.Users.count({
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
		Models.Users.destroy({
			where: criteria
		})
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err); reject(Response.error_msg.implementationError);
			});
	});
};

exports.getAdminUserList = (criteria, projection, limit, offset, sortBy, orderBy) => {
	let where = {};
	let order = [[Sequelize.literal(`${sortBy} ${orderBy}`)]];
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				name: { [Op.like]: "%" + criteria.search + "%" },
				email: { [Op.like]: "%" + criteria.search + "%" },
				phoneNumber: { [Op.like]: "%" + criteria.search + "%" },
			},
		};
	}

	if (criteria.userId) {
		where.id = {
			[Op.notIn]: [criteria.userId],
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
	let skillWhere = {}; 
	let skillRequired = false;
	if(criteria && criteria.skillId){
		skillWhere.skillId={
			[Op.in]:criteria.skillId
		};
		skillRequired=true;
	}
  
	if (criteria["isBlocked"] === 1) where.isBlocked = "1";
	if (criteria["isBlocked"] === 0) where.isBlocked = "0";
	if (criteria["isDeleted"] === 1) where.isDeleted = "1";
	where.isDeleted = "0";
	where.isEmailVerified = "1";
 
	return new Promise((resolve, reject) => {
		Models.Users.findAll({
			limit,
			offset,
			where: where,
			include: [
				{
					model: Models.UserSkills,
					as: "userSkills",
					where :skillWhere,
					required:  skillRequired,
					include: [{model: Models.Skills,
						as: "skillDetails",
						attributes: ["id","name"],
						required: false}]
				}
			],
			attributes: projection,
			order: order,
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.countData = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				name: { [Op.like]: "%" + criteria.search + "%" },
				email: { [Op.like]: "%" + criteria.search + "%" },
				phoneNumber: { [Op.like]: "%" + criteria.search + "%" },
			},
		};
	}

	
	let skillWhere = {}; 
	let skillRequired = false;
	if(criteria && criteria.skillId){
		skillWhere.skillId={
			[Op.in]:criteria.skillId
		};
		skillRequired=true;
	}
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isBlocked"] === 0) where.isBlocked = 0;
	
	where.isDeleted = 0;
	where.isEmailVerified = 1;

	return new Promise((resolve, reject) => {
		Models.Users.count({
			where: where,
			distinct: true,
			col: "id",
			include: [
				{
					model: Models.UserSkills,
					as: "userSkills",
					where :skillWhere,
					required:  skillRequired,
					include: [{model: Models.Skills,
						as: "skillDetails",
						attributes: ["id","name"],
						required: false}]
				}
			],
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.countDataBlocked = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}

	let skillWhere = {}; 
	let skillRequired = false;
	if(criteria && criteria.skillId){
		skillWhere.skillId={
			[Op.in]:criteria.skillId
		};
		skillRequired=true;
	}

	where.isDeleted = 0;
	where.isBlocked = 1;
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({
			where: where,
			distinct: true,
			col: "id",
			include: [
				{
					model: Models.UserSkills,
					as: "userSkills",
					where :skillWhere,
					required:  skillRequired,
					include: [{model: Models.Skills,
						as: "skillDetails",
						attributes: ["id","name"],
						required: false}]
				}
			],
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.countDataUnblocked = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}

	let skillWhere = {}; 
	let skillRequired = false;
	if(criteria && criteria.skillId){
		skillWhere.skillId={
			[Op.in]:criteria.skillId
		};
		skillRequired=true;
	}

	where.isDeleted = 0;
	where.isBlocked = 0;
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({
			where: where,
			distinct: true,
			col: "id",
			include: [
				{
					model: Models.UserSkills,
					as: "userSkills",
					where :skillWhere,
					required:  skillRequired,
					include: [{model: Models.Skills,
						as: "skillDetails",
						attributes: ["id","name"],
						required: false}]
				}
			],
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.countDataUnBlocked = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	
	let skillWhere = {}; 
	let skillRequired = false;
	if(criteria && criteria.skillId){
		skillWhere.skillId={
			[Op.in]:criteria.skillId
		};
		skillRequired=true;
	}

	where.isDeleted = 0;
	where.isBlocked = 0;
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({
			where: where,
			distinct: true,
			col: "id",
			include: [
				{
					model: Models.UserSkills,
					as: "userSkills",
					where :skillWhere,
					required:  skillRequired,
					include: [{model: Models.Skills,
						as: "skillDetails",
						attributes: ["id","name"],
						required: false}]
				}
			],
		})
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
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
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({
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
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({ 
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
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({ attributes: [
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
	if("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt : {[Op.gt]:criteria.startDate} }, { createdAt : {[Op.lte]:criteria.endDate}}];
	} 
	where.isDeleted = "0";
	where.isEmailVerified = 1;
	return new Promise((resolve, reject) => {
		Models.Users.count({ attributes: [
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
