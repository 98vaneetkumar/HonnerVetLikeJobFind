const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let response = require("../../config/response");
let Services = require("../../services");
const env = require("../../config/env")();
var moment = require("moment");
const Sequelize = require("sequelize");
let projection1 = ["id","isBlocked","planName","planAmount", "planTax", "numberOfJob","createdAt", "stripProduct","description","validityType","jobType",
	"numberOfView","concurrentJobsAssignedEachPlan","concurrentJobsAssignedEachPlan","validity", "planType",
	[Sequelize.literal("(SELECT count(recruiter_transaction.id) FROM recruiter_transaction as recruiter_transaction where payment_plan.id=recruiter_transaction.planId)"), "userPlanCount"],
	// [Sequelize.literal("(SELECT (planAmount- (planAmount*discount/100)))"), "planAmount"]
];
let projection2 = ["id","isBlocked","createdAt","planName","planAmount", "planTax", "numberOfJob","validity","jobType","duration","numberOfClicks","description","stripProduct","validityType", "planType",
	[Sequelize.literal("(SELECT count(recruiter_transaction.id) FROM recruiter_transaction as recruiter_transaction where payment_plan.id=recruiter_transaction.planId)"), "userPlanCount"],
	// [Sequelize.literal("(SELECT (planAmount- (planAmount*discount/100)))"), "planAmount"]
];
let projection;
const SECRET_KEY = env.STRIPE.secretKey;
const stripe = require("stripe")(SECRET_KEY);
module.exports = {
	save: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				planName: Joi.string().optional(),
				planType: Joi.number().optional(),
				planAmount: Joi.number().optional(),
				numberOfJob: Joi.number().optional(),
				numberOfView: Joi.number().optional(),
				description: Joi.string().optional(),
				concurrentJobsAssignedEachPlan: Joi.string().optional(),
				nonConcurrentJobsAssignedEachPlan: Joi.string().optional(),
				duration: Joi.number().optional(),
				validityType: Joi.string().optional(),
				numberOfClicks: Joi.number().optional(),
				validity: Joi.string().optional(),
				jobType: Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "planName") && payloadData.planName != "") objToSave.planName = payload.planName;
			if (_.has(payloadData, "planType") && payloadData.planType != "") objToSave.planType = payload.planType;
			if (_.has(payloadData, "planAmount") && payloadData.planAmount != "") objToSave.planAmount = payload.planAmount;
			if (_.has(payloadData, "numberOfJob") && payloadData.numberOfJob != "") objToSave.numberOfJob = payload.numberOfJob;
			if (_.has(payloadData, "numberOfView") && payloadData.numberOfView != "") objToSave.numberOfView = payload.numberOfView;
			if (_.has(payloadData, "concurrentJobsAssignedEachPlan") && payloadData.concurrentJobsAssignedEachPlan != "") objToSave.concurrentJobsAssignedEachPlan = payload.concurrentJobsAssignedEachPlan;
			if (_.has(payloadData, "nonConcurrentJobsAssignedEachPlan") && payloadData.nonConcurrentJobsAssignedEachPlan != "") objToSave.nonConcurrentJobsAssignedEachPlan = payload.nonConcurrentJobsAssignedEachPlan;
			if (_.has(payloadData, "duration") && payloadData.duration != "") objToSave.duration = payload.duration;
			if (_.has(payloadData, "numberOfClicks") && payloadData.numberOfClicks != "") objToSave.numberOfClicks = payload.numberOfClicks;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "validity") && payloadData.validity != "") objToSave.validity = payload.validity;
			if (_.has(payloadData, "validityType") && payloadData.validityType != "") objToSave.validityType = payload.validityType;
			if (_.has(payloadData, "jobType")) objToSave.jobType = payload.jobType;
			objToSave.planTax = 0;
			let create = await Services.PaymentPlanService.saveData(objToSave);
			const planParams = {
				amount: payload.planAmount *100 , // in cents
				interval: "month",
				product: {
					name: payload.planName,
					type: "service",
				},
				currency: "usd",
				nickname: payload.planName,
				id: create.id,
			};

			if (create) {
				if (payload.planType ===0) {
					try {
						const plan = await stripe.plans.create(planParams);
						let stripData = JSON.stringify(plan);
						let objToUpdate = {
							stripProduct: plan.product,
							stripData: stripData
						};
						console.log(objToUpdate, "objToUpdate");
						await Services.PaymentPlanService.updateData({id:create.id}, objToUpdate);
						console.log("Plan created:", plan);
					} catch (err) {
						console.error("Error creating plan:", err);
					}
				}				
				return message.success.ADDED;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	getList: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				planType: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow(""),
				expireSoon: Joi.number().optional(),
				dayType: Joi.string().optional(),
			});
			if (payloadData.planType === "0") {
				projection = projection1;
			} else if (payloadData.planType === "1") {
				projection = projection2;
			}
			// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
			// const fromDate = moment().subtract(7, "day").format("YYYY-MM-DD");
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			let expireSoonEndDate = null;
			if(payload.dayType === "DAY") {
				expireSoonEndDate = moment().add(payload.expireSoon, "days").format("YYYY-MM-DD");
			} else if(payload.dayType === "WEEK") {
				expireSoonEndDate = moment().add(payload.expireSoon, "weeks").format("YYYY-MM-DD");
			} else if (payload.dayType === "MONTH") {
				expireSoonEndDate = moment().add(payload.expireSoon, "months").format("YYYY-MM-DD");
			} 
			payload.expireSoonEndDate = expireSoonEndDate;

			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let isBlocked = payload.isBlocked ? payload.isBlocked : "0";
			let result = {};
			result.count = await Services.PaymentPlanService.count(payload);
			result.data = await Services.PaymentPlanService.getListing(
				payload,
				projection,
				payload.limit || 50,
				payload.skip || 0,
				sortBy,
				orderBy,
				isBlocked
			);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getDetail: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				planType: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			if (payloadData.planType === "0") {
				projection = projection1;
			} else if (payloadData.planType === "1") {
				projection = projection2;
			}
			let detail = await Services.PaymentPlanService.getOne(
				criteria,
				projection
			);
			return detail;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	update: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				planName: Joi.string().optional(),
				planAmount: Joi.number().optional(),
				numberOfJob: Joi.number().optional(),
				numberOfView: Joi.number().optional(),
				description: Joi.string().optional(),
				concurrentJobsAssignedEachPlan: Joi.string().optional(),
				nonConcurrentJobsAssignedEachPlan: Joi.string().optional(),
				duration: Joi.number().optional(),
				numberOfClicks: Joi.number().optional(),
				jobType: Joi.number().valid(0,1).optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "planName") && payloadData.planName != "") objToUpdate.planName = payload.planName;
			if (_.has(payloadData, "planAmount")) objToUpdate.planAmount = payload.planAmount;
			if (_.has(payloadData, "numberOfJob") && payloadData.numberOfJob != "") objToUpdate.numberOfJob = payload.numberOfJob;
			if (_.has(payloadData, "numberOfView") && payloadData.numberOfView != "") objToUpdate.numberOfView = payload.numberOfView;
			if (_.has(payloadData, "concurrentJobsAssignedEachPlan") && payloadData.concurrentJobsAssignedEachPlan != "") objToUpdate.concurrentJobsAssignedEachPlan =payload.concurrentJobsAssignedEachPlan;
			if (_.has(payloadData, "nonConcurrentJobsAssignedEachPlan") &&payloadData.nonConcurrentJobsAssignedEachPlan != "")objToUpdate.nonConcurrentJobsAssignedEachPlan =payload.nonConcurrentJobsAssignedEachPlan;
			if (_.has(payloadData, "validity") && payloadData.validity != "") objToUpdate.validity = payload.validity;
			if (_.has(payloadData, "duration") && payloadData.duration != "") objToUpdate.duration = payload.duration;
			if (_.has(payloadData, "numberOfClicks") && payloadData.numberOfClicks != "") objToUpdate.numberOfClicks = payload.numberOfClicks;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			if (_.has(payloadData, "jobType")) objToUpdate.jobType = payload.jobType;
			let update = await Services.PaymentPlanService.updateData(criteria, objToUpdate);
			let result ={};
			if(update) {
				result.count = await Services.RecruiterPaymentService.paymentUsersCount(criteria);
				return result;
				// return message.success.UPDATED;
			}
			
			/*try {
				let detail = await Services.PaymentPlanService.getOne(criteria, projection);
					const planId = detail.stripProduct;
					console.log(planId, "planId")
					const updatedPlanData = {
				      nickname: payload.planName,
				      product: {
				        name: payload.planName,
				        type: 'service',
				      }
					};
					console.log(updatedPlanData, "updatedPlanData")
					const plan = await stripe.plans.update(planId, updatedPlanData);
					console.log(plan, "plan")
					let stripData = JSON.stringify(plan);
					let objToUpdate = {
						stripData: stripData
					}
					// await Services.PaymentPlanService.updateData(criteria, {objToUpdate});
					console.log('Plan created:', plan);
				} catch (err) {
			    	console.error('Error creating plan:', err);
			  	}*/
			
		}catch (err){
			console.log(err);
			throw err;
		}
	},

	// Recruiter Transaction listing API
	getListTransaction: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			startDate: Joi.date().optional(),
			endDate: Joi.date().optional(),
			planType: Joi.number().optional(),
		});
		// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
		// const fromDate = moment().subtract(7, "day").format("YYYY-MM-DD");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		let projection=["id","isBlocked","createdAt","recruiterId","planId","planName","numberOfJob","numberOfView","concurrentJobsAssignedEachPlan",
			"nonConcurrentJobsAssignedEachPlan","validity","duration","numberOfClicks","stripSubscriptionId","stripSubscriptionData","validityType","description",
			"planType","status","discount",
			[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter.id =recruiter_transaction.recruiterId)"), "recruiterName"],
			[Sequelize.literal("(SELECT (planAmount- (planAmount*discount/100)))"), "planAmount"]
		]; 		
		result.count = await Services.RecruiterPaymentService.countTransaction(payload);
		let subscriptionAmount = await Services.RecruiterPaymentService.subscriptionTransaction();
		let inventoryAmount = await Services.RecruiterPaymentService.inventoryTransaction();
		let totalAmount =  await Services.RecruiterPaymentService.totalTransaction();

		result.subscriptionAmount = subscriptionAmount.dataValues.subscriptionAmount;
		result.inventoryAmount = inventoryAmount.dataValues.inventoryAmount;
		result.totalAmount = totalAmount.dataValues.totalAmount;
		result.listing = await Services.RecruiterPaymentService.getListingTransaction(
			payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		
		return result;
	},
	getListTransactionDetail: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),

			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let projection=["id","isBlocked","createdAt","recruiterId","planId","planName","planAmount","numberOfJob","numberOfView","concurrentJobsAssignedEachPlan",
				"nonConcurrentJobsAssignedEachPlan","validity","duration","numberOfClicks","stripSubscriptionId","stripSubscriptionData","validityType","description",
				"planType","status", "discount",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter.id =recruiter_transaction.recruiterId)"), "recruiterName"],
				[Sequelize.literal("(SELECT (planAmount- (planAmount*discount/100)))"), "planAmount"]
			];
			let detail = await Services.RecruiterPaymentService.getListingTransactionDetail(criteria,projection);
			return detail;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	getOnePlanAllUsers: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isActive: Joi.number().optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		// let criteria = {
		// 	id: payload.id,
		// };
		let result ={};
		let projection=["id","recruiterId","planId","planName","planAmount","numberOfJob","numberOfView","concurrentJobsAssignedEachPlan","nonConcurrentJobsAssignedEachPlan",
			"validity","duration","numberOfClicks","stripSubscriptionId","stripSubscriptionData","validityType","description","planType",
			"status","isSubscription","createdAt","updatedAt",
			[Sequelize.literal("(select (recruiter.name) from recruiter where recruiter.id= recruiter_transaction.recruiterId)"), "username"]
		];
		result.count = await Services.RecruiterPaymentService.paymentUsersCount(payload);
		result.listing = await Services.RecruiterPaymentService.getPaymentUserListing(payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		return result;
	},
	getCheckPromoCode: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				promoCode: Joi.string().required(),
				recuriterId: Joi.string().required(),
				promoType: Joi.number().required(),

			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				code: payload.promoCode,
				promoType: payload.promoType,
				isDeleted:0,
				isBlocked:0
			};
			let result ={};
			let currentDate=moment().format("YYYY-MM-DD"); 
			let projection = ["id","isBlocked", "isDeleted", "name","code","description","startDate", "expiryDate","discountPercentage", "promoType", "createdAt"];
			let detail = await Services.AdminPromoCodeServices.getOne(criteria,projection);
			if (!detail) throw response.error_msg.invalidPromoCode;
			if (detail){
				let startDate = moment(detail.startDate).utc().format("YYYY-MM-DD");
				let expiryDate = moment(detail.expiryDate).utc().format("YYYY-MM-DD");
				if(expiryDate < currentDate) throw response.error_msg.expiredPromoCode;
				if(startDate > currentDate) throw response.error_msg.startedPromoCode;
				result.listing = detail;
			} 
			return result;

		}catch (err) {
			console.log(err);
			throw err;
		} 
		
	},
};