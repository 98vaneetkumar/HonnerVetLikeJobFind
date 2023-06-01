const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const response = require("../../config/response");
const Services = require("../../services");
const Models = require("../../models");
var moment = require("moment");
const env = require("../../config/env")();
const SECRET_KEY = env.STRIPE.secretKey;
const stripe = require("stripe")(SECRET_KEY);

module.exports = {
	addFavourite: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				recuriterId: Joi.string().optional(),
				favourite: Joi.number().valid(0,1).optional(),
				jobPostId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			let condition={
				userId:payload.userId,
				// jobPostId:payload.jobPostId,
			};
			let exist=await Services.FavouriteAndSkippedService.getOneFavourite(condition);
			if(exist){
				if(exist.favourite===1){
					await Services.FavouriteAndSkippedService.delete(condition);
				}
			}
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;   
			if (_.has(payloadData, "jobPostId") && payloadData.jobPostId != "") objToSave.jobPostId = payload.jobPostId;   
			if (_.has(payloadData, "recuriterId") && payloadData.recuriterId != "") objToSave.recuriterId = payload.recuriterId;
			if (_.has(payloadData, "favourite")) objToSave.favourite = payload.favourite;
			let objToactionSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToactionSave.userId = payload.userId;   
			if (_.has(payloadData, "recuriterId") && payloadData.recuriterId != "") objToactionSave.recuriterId = payload.recuriterId;
			objToactionSave.actionType=3;
			await Services.FavouriteAndSkippedService.saveRecruiterView(objToactionSave);
			if(payload&&payload.favourite===0){
				await Services.FavouriteAndSkippedService.delete(condition);
			}else{
				await Services.FavouriteAndSkippedService.saveData(objToSave);
			}
			return message.success.ADDED;
		}catch (err){
			console.log(err);
			throw err;
		}	
	},
	getAllFavourite: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				recuriterId: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
				favourite: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			result.data = await Services.FavouriteAndSkippedService.getListing(
				payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.count= 	await Services.FavouriteAndSkippedService.count(payload);
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	getFavouriteById: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			console.log("This is id====>",criteria);
			let result={};
			result.detail = await Services.FavouriteAndSkippedService.getOneFavourite(criteria);
			let payloads={
				userId:result.detail.userId
			};
			result.workExperiences= await Services.UserBuildResumeService.getWorkExperience(payloads);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	updateFavourite: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				userId: Joi.string().optional(),
				recuriterId: Joi.string().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
				favourite: Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "recuriterId")&& payloadData.recuriterId != "") objToUpdate.recuriterId = payload.recuriterId;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			if (_.has(payloadData, "favourite")) objToUpdate.favourite = payload.favourite;
			if(payloadData.isDeleted&&payloadData.isDeleted.length>0){
				await Services.FavouriteAndSkippedService.delete(criteria);
			}
			await Services.FavouriteAndSkippedService.updateData(criteria, objToUpdate);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	deleteFavourite: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			await Services.FavouriteAndSkippedService.delete(criteria);
			return message.success.DELETED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	addskipped: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				recuriterId: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "recuriterId") && payloadData.recuriterId != "") objToSave.recuriterId = payload.recuriterId;
			let create = await Services.FavouriteAndSkippedService.saveSkipped(objToSave);
			if (create) {
				return message.success.ADDED;
			}
			
		}catch (err){
			console.log(err);
			throw err;
		}	
	},
	getAllskipped: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				recuriterId: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			result.count= 	await Services.FavouriteAndSkippedService.countJob(payload);
			result.data = await Services.FavouriteAndSkippedService.getListingSkipped(
				payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	getskippedById: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let result={};
			result.detail = await Services.FavouriteAndSkippedService.getOneSkipped(criteria);
			let payloads={
				userId:result.detail.userId
			};
			result.workExperiences= await Services.UserBuildResumeService.getWorkExperience(payloads);
			
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	updateskipped: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				userId: Joi.string().optional(),
				recuriterId: Joi.number().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "recuriterId")&& payloadData.recuriterId != "") objToUpdate.recuriterId = payload.recuriterId;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			await Services.FavouriteAndSkippedService.updateJob(criteria, objToUpdate);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	deleteskipped: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			await Services.FavouriteAndSkippedService.deletes(criteria);
			return message.success.DELETED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	addCard: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required(),
				recruiterId: Joi.string().required(),
				isSaved: Joi.number().valid(0, 1).optional(),
				isPrimary: Joi.number().valid(0, 1).required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate = {};
			if (_.has(payloadData, "tokenId") && payloadData.tokenId != ""){
				objToUpdate.tokenId = payload.tokenId;	
			} 

			let criteria = {
				id: payload.recruiterId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let projection = ["id", "name", "email", "isEmailVerified", "countryCode", "phoneNumber", "customerId"];
			let recruiterUsers = await Services.RecruiterService.getDetail(criteria, projection);
			let  recruiterCustomer= await Services.RecruiterPaymentService.getStripCustomerOne({recruiterId: payload.recruiterId});
			if (!recruiterUsers) throw Response.error_msg.InvalidID;
			// let companyEmail = recruiterUsers.companyEmail
			let companyEmail = recruiterUsers.email;
			let customerId = "";
			if (recruiterCustomer) {
				customerId = recruiterCustomer.customerId;
			}else{
				const customer = await stripe.customers.create({
					description: "Honorvet Customer",
					email:companyEmail
				});
				let customerJson =JSON.stringify(customer);
				let objToUpdateCustomer = {
					customerId: customer.id,
					stripeBody: customerJson
				};
				objToUpdateCustomer.recruiterId = payload.recruiterId;
				customerId = customer.id;
				// let updateData = await Services.RecruiterService.updateData(criteria, objToUpdateCustomer);
				await Services.RecruiterPaymentService.saveStripCustomerData(objToUpdateCustomer);
			}
			console.log(customerId, "customerId");
			// let tokenId = payload.tokenId;
			// let tokenId = 'tok_1MoGl2FGzVjaUNdaOuwvr5Y2';
			const token = await stripe.tokens.create({card: {
			        number: '4242424242424242',
			        exp_month: 12,
			        exp_year: 2024,
			        cvc: '314',
			        name: 'shreeaansh Gupta'
			    },
			});
			console.log(token, "token")
			let tokenId = token.id;
			console.log(tokenId, "tokenId")
			try{
				/*if (payload.isPrimary === 1) {
					console.log(1);
					var card = await stripe.customers.createSource(customerId, {source: tokenId} );
					await Services.RecruiterPaymentService.updateData({recruiterId: payload.recruiterId}, {isPrimary:0});
				}else{
					console.log(2);
					var cardDetail = await stripe.tokens.retrieve(tokenId);
					var card = cardDetail.card;
				}*/
				var card = await stripe.customers.createSource(customerId, {source: tokenId} );
				await Services.RecruiterPaymentService.updateData({recruiterId: payload.recruiterId}, {isPrimary:0});
				console.log(card, "card>>>>>>>>>");
				let cardJson =JSON.stringify(card);
				let saveCustomer = {
					recruiterId: payload.recruiterId,
					stripeCardToken: tokenId,
					stripeCardId: card.id,
					customerId: customerId,
					stripeSourceId: card.id,
					stripeSourceBody: cardJson,
					expYear: card.exp_year,
					expMonth: card.exp_month,
					last4: card.last4,
					cardHolderName: card.name,
					isSaved: payload.isSaved,
					isPrimary: payload.isPrimary
				};
				console.log(saveCustomer, "saveCustomer")
				if (card) {
					await Services.RecruiterPaymentService.saveData(saveCustomer);
				}
			} catch (err){
				console.log(err);
				throw err;
			}
			return message.success.ADDED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	updateCard_old: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				tokenId: Joi.string().required(),
				recruiterId: Joi.string().required(),
				isSaved: Joi.number().valid(0, 1).optional(),
				isPrimary: Joi.number().valid(0, 1).required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.recruiterId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let projection = ["id", "name", "email", "isEmailVerified", "countryCode", "phoneNumber", "customerId"];
			let recruiterUsers = await Services.RecruiterService.getDetail(criteria, projection);
			if (!recruiterUsers) throw Response.error_msg.InvalidID;
			let companyEmail = recruiterUsers.email;
			let customerId = recruiterUsers.customerId;
			if (customerId !=="" && customerId !== null) {
				customerId = recruiterUsers.customerId;
			}else{
				const customer = await stripe.customers.create({
					description: "Honorvet Customer",
					email:companyEmail
				});
				let customerJson =JSON.stringify(customer);
				let objToUpdateCustomer = {
					customerId: customer.id,
					stripeBody: customerJson
				};
				customerId = customer.id;
				await Services.RecruiterService.updateData(criteria, objToUpdateCustomer);
			}
			let tokenId = payload.tokenId;
			// let tokenId = 'tok_1MniGTFGzVjaUNdaJHm4tzc1';
			// const token = await stripe.tokens.create({card: {
			//         number: '4242424242424242',
			//         exp_month: 12,
			//         exp_year: 2024,
			//         cvc: '314',
			//         name: 'shreeaansh Gupta'
			//     },
			// });
			// console.log(token, "token")
			// let tokenId = token.id;
			// console.log(tokenId, "tokenId")
			try{
				if (payload.isPrimary === 1) {
					console.log(1);
					var card = await stripe.customers.createSource(customerId, {source: tokenId} );
					await Services.RecruiterPaymentService.updateData({recruiterId: payload.recruiterId}, {isPrimary:0});
				}else{
					console.log(2);
					var card = await stripe.tokens.retrieve(tokenId);
				}
				console.log(card, "card")
				let cardJson =JSON.stringify(card);
				let updateCustomer = {
					recruiterId: payload.recruiterId,
					stripeCardToken: tokenId,
					stripeCardId: card.id,
					customerId: customerId,
					stripeSourceId: card.id,
					stripeSourceBody: cardJson,
					isSaved: payload.isSaved,
					isPrimary: payload.isPrimary
				};
				if (card) {
					let updateCriteria= {
						id: payload.id
					};
					await Services.RecruiterPaymentService.updateData(updateCriteria, updateCustomer);
				}
			} catch (err){
				console.log(err);
				throw err;
			}
			
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	updateCard: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				tokenId: Joi.string().required(),
				recruiterId: Joi.string().required(),
				isSaved: Joi.number().valid(0, 1).optional(),
				isPrimary: Joi.number().valid(0, 1).required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.recruiterId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let updateCriteria= {
				id: payload.id
			};
			let projection = ["id", "name", "email", "isEmailVerified", "countryCode", "phoneNumber", "customerId"];
			let recruiterUsers = await Services.RecruiterService.getDetail(criteria, projection);
			if (!recruiterUsers) throw Response.error_msg.InvalidID;
				await Services.RecruiterPaymentService.updateData({recruiterId: payload.recruiterId}, {isPrimary:0});
				await Services.RecruiterPaymentService.updateData(updateCriteria, {isPrimary:1});
				return response.STATUS_MSG.SUCCESS.DEFAULT;
				
		}catch (err){
			console.log(err);
			throw err;
		}

	},
	getAllCardlist: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				recruiterId: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			let criteria = {
				recruiterId :payload.recruiterId,
				isBlocked:"0",
				isDeleted:"0"
			};
			result.listing = await Services.RecruiterPaymentService.getListing(
				criteria, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.count= 	await Services.RecruiterPaymentService.count(criteria);
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	deleteCard: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				recruiterId: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			await Services.RecruiterPaymentService.delete(criteria);
			return message.success.DELETED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	recruiterSubcriptionPlan: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				recruiterId: Joi.string().required(),
				subscriptionId: Joi.string().required().allow(""),
				cardId: Joi.string().required().allow(""),
				promoCardId: Joi.string().optional().allow(""),
				firstName: Joi.string().optional().allow(""),
				lastName: Joi.string().optional().allow(""),
				companyName: Joi.string().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				address: Joi.string().optional().allow(""),
				state: Joi.string().optional().allow(""),
				city: Joi.string().optional().allow(""),
				zipCode: Joi.string().optional().allow(""),
				countryName: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate = {};
			let  Projection1 = ["id","recruiterId","firstName","lastName","phoneNumber","companyName","state","city","countryCode","address","recruiterId"];
			let criteria = {
				recruiterId: payload.recruiterId
			};
			let subscriptionObj = {};
			if (_.has(payloadData, "firstName") && payloadData.firstName != "") objToUpdate.firstName = payload.firstName;
			if (_.has(payloadData, "lastName") && payloadData.lastName != "") objToUpdate.lastName = payload.lastName;
			if (_.has(payloadData, "companyName") && payloadData.companyName != "") objToUpdate.companyName = payload.companyName;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToUpdate.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToUpdate.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "address") && payloadData.address != "") objToUpdate.address = payload.address;
			if (_.has(payloadData, "state") && payloadData.state != "") objToUpdate.state = payload.state;
			if (_.has(payloadData, "city") && payloadData.city != "") objToUpdate.city = payload.city;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			if (_.has(payloadData, "countryName") && payloadData.countryName != "") objToUpdate.countryName = payload.countryName;
			if (_.has(payloadData, "promoCardId") && payloadData.promoCardId != "") subscriptionObj.promoCodeId = payload.promoCardId;
			objToUpdate.recruiterId=payload.recruiterId;

			let billingAddress = await Services.RecruiterService.getAllBillingAddress(criteria, Projection1);
			if(billingAddress == null ) {
				await Services.BaseService.saveData(Models.BillingAddress,objToUpdate);
			} else if (billingAddress.dataValues.recruiterId) {
				await Services.BaseService.updateData(Models.BillingAddress,criteria, objToUpdate);
			}
			let projectionPromoCode = ["id","isBlocked", "isDeleted", "name","code","description","startDate", "expiryDate","discountPercentage", "promoType", "createdAt"];

			let planProjection1 = ["id","isBlocked","planName", "duration", "planAmount","numberOfJob","createdAt", "stripProduct","description","validityType",
				"numberOfView","concurrentJobsAssignedEachPlan","concurrentJobsAssignedEachPlan","validity", "planType"];
			let planDetail = await Services.PaymentPlanService.getOne({id:payload.subscriptionId},planProjection1);
			if (planDetail) {
				console.log("Case1");
				subscriptionObj.recruiterId = payload.recruiterId;
				subscriptionObj.planId = planDetail.id;
				subscriptionObj.planName = planDetail.planName;
				subscriptionObj.planAmount = planDetail.planAmount;
				subscriptionObj.numberOfJob = planDetail.numberOfJob;
				subscriptionObj.numberOfView = planDetail.numberOfView;
				subscriptionObj.validity = planDetail.validity;
				subscriptionObj.duration = planDetail.duration;
				subscriptionObj.numberOfClicks = planDetail.numberOfClicks;
				subscriptionObj.validityType = planDetail.validityType;
				subscriptionObj.description = planDetail.description;
				subscriptionObj.planType = planDetail.planType;
				subscriptionObj.status = 0;
				let saveSubscription=await Services.RecruiterPaymentService.saveTransactionData(subscriptionObj);

				try{
					let cardProjection1 = ["id","isBlocked", "isPrimary", "stripeCardToken", "customerId"];
					let cardDetail = await Services.RecruiterPaymentService.getOne({id:payload.cardId}, cardProjection1);
					if (cardDetail && cardDetail.isPrimary ==0) {
						console.log("Case5");
						await Services.RecruiterPaymentService.updateData({recruiterId: payload.recruiterId}, {isPrimary:0});
						var card = await stripe.customers.createSource(cardDetail.customerId, {source: cardDetail.stripeCardToken} );
						await Services.RecruiterPaymentService.updateData({id: payload.cardId}, {isPrimary:1});
					}
					let discountCoupon =null;
					let discountPercentage =0;

					if (_.has(payloadData, "promoCardId") && payloadData.promoCardId != ""){
						let currentDate=moment().format("YYYY-MM-DD"); 
						let detail = await Services.AdminPromoCodeServices.getOne({id:payload.promoCardId},projectionPromoCode);
						if (!detail) throw response.error_msg.invalidPromoCode;
						if (detail){
							let startDate = moment(detail.startDate).utc().format("YYYY-MM-DD");
							let expiryDate = moment(detail.expiryDate).utc().format("YYYY-MM-DD");
							if(expiryDate < currentDate) throw response.error_msg.expiredPromoCode;
							if(startDate > currentDate) throw response.error_msg.startedPromoCode;
						 	discountCoupon = detail.code;
						 	discountPercentage = detail.discountPercentage;
						} 	
					}
					
					let subscriptionPaymentObj = {
						customer: cardDetail.customerId,
						items: [{price: payload.subscriptionId }],
						// add any other desired subscription parameters here
					};
					if (discountCoupon !==null) {
						subscriptionPaymentObj.coupon=discountCoupon;
					}
					// console.log(subscriptionPaymentObj, "subscriptionObj>>>")
					var subscription = await stripe.subscriptions.create(subscriptionPaymentObj);
					// console.log(subscription, "subscription")
					let subscriptionJSON =JSON.stringify(subscription);
					if (subscription) {
						await Services.RecruiterPaymentService.updateTransactionData({recruiterId: payload.recruiterId, planType:0}, {isSubscription:0});
						let updateTransactionData = {
							stripSubscriptionId : subscription.id,
							stripSubscriptionData : subscriptionJSON,
							promoCode : discountCoupon,
							status:1,
							isSubscription:1
						};
						updateTransactionData.discount = discountPercentage;
						console.log("Case2");
						await Services.RecruiterPaymentService.updateTransactionData({id: saveSubscription.id}, updateTransactionData);
					}
				// console.log(subscription, "subscription");
				}catch (err){
					console.error("Error creating subscription:", err);
					console.log("Case3");
					let errData=JSON.stringify(err);
					let updateFailedTransactionData = {
						stripSubscriptionData: errData,
						status:2
					};
					await Services.RecruiterPaymentService.updateTransactionData({id: saveSubscription.id}, updateFailedTransactionData);
					throw err;
				}
			}			
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	cancelSubscription:async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				subscriptionId : Joi.string().required(),
				recruiterId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			
			let criteria = {
				id : payload.subscriptionId
			};

			let subscription = await Services.RecruiterPaymentService.getRecruiterTransaction(criteria);
			if (subscription) {
				let stripSubscriptionId = subscription.stripSubscriptionId;
				let subscriptionCancel = {
					recruiterId: payload.recruiterId,
					planId: payload.subscriptionId,
					stripSubscriptionId: stripSubscriptionId
				};
				try{
					const subscriptionStripCancel = await stripe.subscriptions.del(stripSubscriptionId);
					const planInvoice = await stripe.invoices.retrieve(subscriptionStripCancel.latest_invoice);
					let subscriptionCancelJSON =JSON.stringify(subscriptionStripCancel);
					let planInvoiceJSON =JSON.stringify(planInvoice);
					subscriptionCancel.stripSubscriptionData = subscriptionCancelJSON;
					subscriptionCancel.stripeBodyInvoice = planInvoiceJSON;

					await Services.RecruiterPaymentService.saveRecruiterCancelSubscription(subscriptionCancel);
					await Services.RecruiterPaymentService.updateTransactionData({id: subscription.id}, {isSubscription:2});
				}catch (err){
					console.log(err);
					throw err;
				}
			}
			return response.STATUS_MSG.SUCCESS.DEFAULT;

		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	recruiterPurchaseInventroyPlan: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				recruiterId: Joi.string().required(),
				inventoryId: Joi.string().required().allow(""),
				cardId: Joi.string().required().allow(""),
				promoCardId: Joi.string().optional().allow(""),
				firstName: Joi.string().optional().allow(""),
				lastName: Joi.string().optional().allow(""),
				companyName: Joi.string().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				address: Joi.string().optional().allow(""),
				state: Joi.string().optional().allow(""),
				city: Joi.string().optional().allow(""),
				zipCode: Joi.string().optional().allow(""),
				countryName: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate = {};
			let  Projection1 = ["id","recruiterId","firstName","lastName","phoneNumber","companyName","state","city","countryCode","address","recruiterId"];
			let criteria = {
				recruiterId: payload.recruiterId
			};
			let  recruiterCustomer= await Services.RecruiterPaymentService.getStripCustomerOne({recruiterId: payload.recruiterId});
			if (!recruiterCustomer) throw Response.error_msg.InvalidID;

			let subscriptionObj = {};
			if (_.has(payloadData, "firstName") && payloadData.firstName != "") objToUpdate.firstName = payload.firstName;
			if (_.has(payloadData, "lastName") && payloadData.lastName != "") objToUpdate.lastName = payload.lastName;
			if (_.has(payloadData, "companyName") && payloadData.companyName != "") objToUpdate.companyName = payload.companyName;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToUpdate.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToUpdate.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "address") && payloadData.address != "") objToUpdate.address = payload.address;
			if (_.has(payloadData, "state") && payloadData.state != "") objToUpdate.state = payload.state;
			if (_.has(payloadData, "city") && payloadData.city != "") objToUpdate.city = payload.city;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			if (_.has(payloadData, "countryName") && payloadData.countryName != "") objToUpdate.countryName = payload.countryName;
			if (_.has(payloadData, "promoCardId") && payloadData.promoCardId != "") subscriptionObj.promoCodeId = payload.promoCardId;
			objToUpdate.recruiterId=payload.recruiterId;

			let billingAddress = await Services.RecruiterService.getAllBillingAddress(criteria, Projection1);
			if(billingAddress == null ) {
				await Services.BaseService.saveData(Models.BillingAddress,objToUpdate);
			} else if (billingAddress.dataValues.recruiterId) {
				await Services.BaseService.updateData(Models.BillingAddress,criteria, objToUpdate);
			}
			let billingName = payload.fileName+" "+payload.lastName;
			let planProjection1 = ["id","isBlocked","planName", "duration", "planAmount","numberOfJob", "numberOfJob", "createdAt", "stripProduct","description","validityType",
				"numberOfView","concurrentJobsAssignedEachPlan","concurrentJobsAssignedEachPlan","validity", "planType"];
			let planDetail = await Services.PaymentPlanService.getOne({id:payload.inventoryId},planProjection1);
			let cardDetail = await Services.RecruiterPaymentService.getOne({id:payload.cardId});
			if (planDetail) {
				console.log("Case1");
				subscriptionObj.recruiterId = payload.recruiterId;
				subscriptionObj.planId = planDetail.id;
				subscriptionObj.planName = planDetail.planName;
				subscriptionObj.planAmount = planDetail.planAmount;
				subscriptionObj.numberOfJob = planDetail.numberOfJob;
				subscriptionObj.numberOfView = planDetail.numberOfView;
				subscriptionObj.validity = planDetail.validity;
				subscriptionObj.duration = planDetail.duration;
				subscriptionObj.numberOfClicks = planDetail.numberOfClicks;
				subscriptionObj.validityType = planDetail.validityType;
				subscriptionObj.description = planDetail.description;
				subscriptionObj.planType = planDetail.planType;
				subscriptionObj.status = 0;
				let saveSubscription=await Services.RecruiterPaymentService.saveTransactionData(subscriptionObj);
				// console.log(saveSubscription, "saveSubscription")

				let discountPercentage =0;
				let discountCoupon =null;
				let amoutVal =0;
				let projectionPromoCode = ["id","isBlocked", "isDeleted", "name","code","description","startDate", "expiryDate","discountPercentage", "promoType", "createdAt"];
				if (_.has(payloadData, "promoCardId") && payloadData.promoCardId != ""){
					let currentDate=moment().format("YYYY-MM-DD"); 
					let detail = await Services.AdminPromoCodeServices.getOne({id:payload.promoCardId},projectionPromoCode);
					if (!detail) throw response.error_msg.invalidPromoCode;
					if (detail){
						let startDate = moment(detail.startDate).utc().format("YYYY-MM-DD");
						let expiryDate = moment(detail.expiryDate).utc().format("YYYY-MM-DD");
						if(expiryDate < currentDate) throw response.error_msg.expiredPromoCode;
						if(startDate > currentDate) throw response.error_msg.startedPromoCode;
						discountPercentage = detail.discountPercentage;
						discountCoupon = detail.code;
					} 	
				}

				if (discountPercentage !==0) {
					amoutVal = planDetail.planAmount - ( planDetail.planAmount * discountPercentage/100 );
				}else{
					amoutVal =planDetail.planAmount;
				}	
				console.log(amoutVal, "amount");
				try{
					const paymentIntent = await stripe.paymentIntents.create({
						amount: amoutVal * 100,
						currency: "usd",
						customer: recruiterCustomer.customerId,
						capture_method: "manual",
						confirm:true,
						error_on_requires_action: true,
						description: planDetail.description,
						payment_method: cardDetail.stripeSourceId,
						payment_method_types: ["card"],
						shipping: {
							name: billingName,
							address: {
								line1: payload.address,
								postal_code: payload.zipCode,
								city: payload.city,
								state: payload.state,
								country: "US",
							},
						},
					});
					const paymentIntentCapture = await stripe.paymentIntents.capture(paymentIntent.id);
					let paymentIntentJSON =JSON.stringify(paymentIntent);
					if(paymentIntentCapture){
						await Services.RecruiterPaymentService.updateTransactionData({recruiterId: payload.recruiterId, planType:1}, {isSubscription:0});
						let updateTransactionData = {
							stripSubscriptionId : paymentIntent.id,
							stripSubscriptionData : paymentIntentJSON,
							status:1,
							isSubscription:1
						};
						updateTransactionData.discount = discountPercentage;
						updateTransactionData.promoCode = discountCoupon;
						console.log("Case2");
						await Services.RecruiterPaymentService.updateTransactionData({id: saveSubscription.id}, updateTransactionData);
					}

				}catch (err){
					console.error("Error creating subscription:", err);
					console.log("Case3");
					let errData=JSON.stringify(err);
					let updateFailedTransactionData = {
						stripSubscriptionData: errData,
						status:2
					};
					await Services.RecruiterPaymentService.updateTransactionData({id: saveSubscription.id}, updateFailedTransactionData);
					throw err;
				}
			}			
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err){
			console.log(err);
			throw err;
		}
	}
};