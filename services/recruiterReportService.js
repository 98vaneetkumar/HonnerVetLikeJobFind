"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");

exports.countTotalInvetoryUsed = (criteria,planType) => {
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
	
	where = {
		isDeleted: 0,
		planType: planType,
	}; 
	return new Promise((resolve, reject) => {
		Models.UserSubscriptionPlan.count({
			where: where,
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

exports.countTotalInvetoryPlan = (criteria,planType) => {
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
	
	where = {
		isDeleted: 0,
		planType: planType,
	}; 
	return new Promise((resolve, reject) => {
		Models.PaymentPlan.count({
			where: where,
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

exports.countEmail = (criteria,actionType) => {
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
	where.recuiterId=criteria.recruiterId;
	where.actionType=actionType;
	return new Promise((resolve, reject) => {
		Models.RecruiterView.count({
			where: where,
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

exports.searchConductByMonth = async (criteria) => {
	let where = {
		isDeleted: 0,
	};

	if (criteria && criteria.search) {
		where[Op.or] = {
			name: { [Op.like]: `%${criteria.search}%` },
			email: { [Op.like]: `%${criteria.search}%` },
			phoneNumber: { [Op.like]: `%${criteria.search}%` },
		};
	}

	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isBlocked"] === 0) where.isBlocked = 0;

	let startDate, endDate;

	if ("startDate" in criteria && "endDate" in criteria) {
		startDate = criteria.startDate;
		endDate = criteria.endDate;
	} else {
		// Set default time range to the last month
		let lastMonth = new Date();
		lastMonth.setMonth(lastMonth.getMonth() - 1);
		startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
		endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
	}

	where.createdAt = {
		[Op.gte]: startDate,
		[Op.lte]: endDate,
	};

	return Models.RecruiterView.findAll({
		attributes: [
			[Sequelize.fn("count", Sequelize.col("createdAt")), "count"],
			[Sequelize.fn("date_format", Sequelize.col("createdAt"), "%Y-%m"), "month"],
		],
		where: where,
		group: [Sequelize.fn("date_format", Sequelize.col("createdAt"), "%Y-%m")],
		raw: true,
	});
};

Models.RecruiterSearchKey.belongsTo(Models.Users, {
	foreignKey: "userId",
});

exports.searchByKeywords = (criteria) => {
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
	where.recuiterId=criteria.recruiterId;
	return new Promise((resolve, reject) => {
		Models.RecruiterSearchKey.count({
			where: where,
			include: [
				{
					model: Models.Users,
					attributes: ["id","name","email"],
				},
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

// Models.UserSubscriptionPlan.belongsTo(Models.Users, {
// 	foreignKey: "userId",
// });
 
// exports.top10inventoryUsedByUser = () => {
// 	return Models.UserSubscriptionPlan.findAll({
// 		attributes: [
// 			"userId",
// 			[Sequelize.fn("count", Sequelize.col("*")), "count"],
// 		],
// 		include: [
// 			{
// 				model: Models.Users,
// 				attributes: ["id","name"],
// 			},
// 		],
// 		group: ["userId"],
// 		order: [[Sequelize.literal("count DESC")]],
// 		limit: 10,
// 		raw: true,
// 	});
// };
  