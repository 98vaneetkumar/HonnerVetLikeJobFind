"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");
const Response = require("../config/response");
//const baseService = require("./base");
const moment = require("moment");


/**
 * ######### @function getDetail ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve users ########
 */
exports.getDetail = (criteria, projection) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		Models.Recruiter.findOne({ where: criteria,
			attributes: projection })
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

exports.getAdminRecruiterList = (criteria, projection, limit, offset, sortBy, orderBy) => {
	let where = {};
	let order = [[Sequelize.literal(`${sortBy} ${orderBy}`)]];
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				name: { [Op.like]: "%" + criteria.search + "%" },
				email: { [Op.like]: "%" + criteria.search + "%" },
				phoneNumber: { [Op.like]: "%" + criteria.search + "%" },
				companyName: {[Op.like]: "%" + criteria.search + "%" }
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
	if (criteria["isBlocked"] === 1) where.isBlocked = "1";
	if (criteria["isBlocked"] === 0) where.isBlocked = "0";
	if (criteria["isDeleted"] === 1) where.isDeleted = "1";
	if(criteria&&criteria.isAdminApproved){
		where.isAdminApproved = criteria.isAdminApproved;
	}
	where.isDeleted = "0";
	where.isEmailVerified = "1";
	where.userType = "SUPER_RECRUITER";
 
	return new Promise((resolve, reject) => {
		Models.Recruiter.findAll({
			limit,
			offset,
			where: where,
			attributes: projection,
			order: order,
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
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isBlocked"] === 0) where.isBlocked = 0;
	where.isDeleted = 0;
	where.isEmailVerified = 1;
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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

exports.countDataActive = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	where.isDeleted = 0;
	// where.isBlocked = 0;
	where.isAdminApproved="1";
	where.isEmailVerified = 1;
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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

exports.countDataBlocked = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	where.isDeleted = 0;
	// where.isBlocked = 1;
	where.isAdminApproved="-1";
	where.isEmailVerified = 1;
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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

exports.countDataPending = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	where.isDeleted = "0";
	where.isAdminApproved = "0";
	where.isEmailVerified = "1";
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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
exports.countDataApproved = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	where.isDeleted = "0";
	where.isAdminApproved = "1";
	where.isEmailVerified = "1";
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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
exports.countDataRejected = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	where.isDeleted = "0";
	where.isAdminApproved = "-1";
	where.isEmailVerified = "1";
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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


exports.countDataIsApproved = (criteria) => {
	let where = {};
	if ("startDate" in criteria && "endDate" in criteria) {
		where[Op.and] = [{ createdAt: { [Op.gt]: criteria.startDate } }, { createdAt: { [Op.lte]: criteria.endDate } }];
	}
	where.isDeleted = "0";
	if (criteria && criteria.isAdminApproved) {
		where.isAdminApproved = criteria.isAdminApproved;
	}
	where.isEmailVerified = "1";
	where.userType = "SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
			where: where,
			distinct: true,
			col: "id",
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

Models.RecruiterUsers.hasMany(Models.Permission);


Models.RecruiterUsers.hasMany(Models.AssignUserGroup, {
	foreignKey: "recruiterUserId",
});

Models.AssignUserGroup.belongsTo(Models.GroupPermission, {
	foreignKey: "groupPermissionId",
});



exports.getAdminSubRecruiterList = (criteria,projection,limit, offset, sortBy, orderBy) => {
	let where = {};
	let wheres = {};
	let order = [[Sequelize.literal(`${sortBy} ${orderBy}`)]];
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
					[Op.in]: Sequelize.literal(`(SELECT id FROM recruiter WHERE companyName LIKE "%${criteria.search}%")`)
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
	where.isDeleted = 0;
	where.isBlocked = 0;
	wheres.isDeleted = 0;
	wheres.isBlocked = 0;
	wheres.select = 0;
	where.recruiterId= criteria.id;
 
	return new Promise((resolve, reject) => {
		Models.RecruiterUsers.findAll({
			limit,
			offset,
			attributes: projection,
			where: where,
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
					}
				}
			],
			order: order
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
exports.countSubRecruiter = async (criteria) => {
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
					[Op.in]: Sequelize.literal(`(SELECT id FROM recruiter WHERE companyName LIKE "%${criteria.search}%")`)
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
	where.recruiterId = criteria.id;
	return await baseService.count(Models.RecruiterUsers, where);
};

exports.getSubRecruiterDetail = (criteria, Projection) => {
	let where ={};
	where.isDeleted = 0;
	where.isBlocked = 0;
	return new Promise((resolve, reject) => {
		Models.RecruiterUsers
			.findOne({
				where: criteria,
				attributes: Projection,
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

exports.getCompanyJobslisting = (criteria, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.recuiterId = criteria.id;
	return new Promise((resolve, reject) => {
		Models.JobPosts
			.findAll({
				limit,
				offset,
				where: where,
				// attributes: projection,
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

exports.countCompanyJobs = async (criteria) => {
	let where = {};  
	where.isBlocked = 0;
	where.isDeleted = 0;
	where.recuiterId = criteria.id;
	return await baseService.count(Models.JobPosts, where);
};

exports.getSubRecruiterJobslisting = (criteria,projection, limit, offset) => {
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
				jobTitle: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.subRecuiterId = criteria.id;
	return new Promise((resolve, reject) => {
		Models.JobPosts
			.findAll({
				limit,
				offset,
				where: where,
				attributes: projection,
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

exports.getSubRecruiterDetailById = (criteria,projection, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	]; 
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.id = criteria.id;
	return new Promise((resolve, reject) => {
		Models.JobPosts
			.findOne({
				limit,
				offset,
				where: where,
				attributes: projection,
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



exports.countSubRecruiterJobs = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				jobTitle: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	where.isBlocked = 0;
	where.isDeleted = 0;
	where.subRecuiterId = criteria.id;
	return await baseService.count(Models.JobPosts, where);
};

exports.getSubRecruiterCandidateHiredRejectedlisting = (criteria,projection, limit, offset) => {
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
				note: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.subRecruiterId = criteria.id;
	if (criteria && criteria.status === 0) where.status = 0;
	if (criteria && criteria.status === 1) where.status = 1;
	if (criteria && criteria.status === 2) where.status = 2;
	if (criteria && criteria.status === 3) where.status = 3;
	return new Promise((resolve, reject) => {
		Models.UserJobApplyNotes
			.findAll({
				limit,
				offset,
				where: where,
				attributes: projection,
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

exports.getSubRecruiterCandidateHiredRejectedDetail = (criteria,projection, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.id= criteria.id;
	return new Promise((resolve, reject) => {
		Models.UserJobApplyNotes
			.findOne({
				limit,
				offset,
				where: where,
				attributes: projection,
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

exports.countSubRecruiterCandidate = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				id: {
					[Op.like]: "%" + criteria.search + "%"
				},
				note: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	where.isBlocked = 0;
	where.isDeleted = 0;
	where.subRecruiterId = criteria.id;	
	if (criteria && criteria.status === 0) where.status = 0;
	if (criteria && criteria.status === 1) where.status = 1;
	if (criteria && criteria.status === 2) where.status = 2;
	if (criteria && criteria.status === 3) where.status = 3;
	return await baseService.count(Models.UserJobApplyNotes, where);
};
exports.countSubscriptionHistory = async (criteria) => {
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
				planName: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	where.isBlocked = 0;
	where.isDeleted = 0;
	where.recruiterId = criteria.id;
	where.planType=0;
	return await baseService.count(Models.RecruiterTransaction, where,order);
};

exports.getSubscriptionHistorylisting = (criteria, limit, offset) => {
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
				planName: {
					[Op.like]: "%" + criteria.search + "%"
				}
			}
		};
	} 
	
	where.isDeleted = 0;
	where.isBlocked = 0;
	where.recruiterId = criteria.id;
	where.planType=0;
	return new Promise((resolve, reject) => {
		Models.RecruiterTransaction
			.findAll({
				limit,
				offset,
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
	where.isAdminApproved = "1";
	where.userType="SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({
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
	where.isAdminApproved = "1";
	where.userType="SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({ 
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
	where.isAdminApproved = "1";
	where.userType="SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({ attributes: [
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
	where.isAdminApproved = "1";
	where.userType="SUPER_RECRUITER";
	return new Promise((resolve, reject) => {
		Models.Recruiter.count({ attributes: [
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