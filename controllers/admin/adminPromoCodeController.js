const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let response = require("../../config/response");
let Services = require("../../services");
const env = require("../../config/env")();
const SECRET_KEY = env.STRIPE.secretKey;
const stripe = require("stripe")(SECRET_KEY);
let projection = ["id","isBlocked","name","code","description","startDate", "expiryDate","discountPercentage","createdAt","promoType"];
module.exports = {
	save: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				name: Joi.string().optional(),
				code: Joi.string().optional(),
				description: Joi.string().optional(),
				startDate: Joi.date().optional(),
				expiryDate: Joi.date().optional(),
				discountPercentage: Joi.number().optional(),
				promoType: Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let condition = {
				code: payload.code,
				isDeleted: 0
			};
			let checkPromoCode = await Services.AdminPromoCodeServices.getListing(condition);
			if (checkPromoCode && checkPromoCode.length > 0 && checkPromoCode[0].code === payload.code) {
				throw response.error_msg.alreadyPromoCode;
			}
			let objToSave = {};
			if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
			if (_.has(payloadData, "code") && payloadData.code != "") objToSave.code = payload.code;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "startDate") && payloadData.startDate != "") objToSave.startDate = payload.startDate;
			if (_.has(payloadData, "expiryDate") && payloadData.expiryDate != "") objToSave.expiryDate = payload.expiryDate;
			if (_.has(payloadData, "discountPercentage") && payloadData.discountPercentage != "") objToSave.discountPercentage = payload.discountPercentage;
			if (_.has(payloadData, "promoType")) objToSave.promoType = payload.promoType;
			let addPromoCode = await Services.AdminPromoCodeServices.saveData(objToSave);
			if (payload.promoType ===0 && addPromoCode) {
				try{
					let getCouponDetail = await createCoupon(payload.discountPercentage, payload.code);
				}catch (err){
					console.log(err);
					throw err;
				}
			}
			
			if(addPromoCode) {
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
				search: Joi.string().optional().allow(""),
				promoType:Joi.number().optional(),
				startDate: Joi.date().optional(),
				expiryDate: Joi.date().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let result = {};
			result.count = await Services.AdminPromoCodeServices.count(payload);
			result.data = await Services.AdminPromoCodeServices.getListing(
				payload,
				projection,
				payload.limit || 50,
				payload.skip || 0,
				sortBy,
				orderBy
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
			let detail = await Services.AdminPromoCodeServices.getOne(
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
				name: Joi.string().optional(),
				code: Joi.string().optional(),
				description: Joi.string().optional(),
				startDate: Joi.date().optional(),
				expiryDate: Joi.date().optional(),
				discountPercentage: Joi.number().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
				promoType: Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "name") && payloadData.name != "") objToUpdate.name = payload.name;
			if (_.has(payloadData, "code") && payloadData.code != "") objToUpdate.code = payload.code;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "startDate") && payloadData.startDate != "") objToUpdate.startDate = payload.startDate;
			if (_.has(payloadData, "expiryDate") && payloadData.expiryDate != "") objToUpdate.expiryDate = payload.expiryDate;
			if (_.has(payloadData, "discountPercentage") && payloadData.discountPercentage != "") objToUpdate.discountPercentage = payload.discountPercentage;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			if (_.has(payloadData, "promoType")) objToUpdate.promoType = payload.promoType;
			let update = await Services.AdminPromoCodeServices.updateData(criteria, objToUpdate);
			if(update) {
				return message.success.UPDATED;
			}
		}catch (err){
			console.log(err);
			throw err;
		}
	},

};
let createCoupon = async (percent_off, couponCode) => {
	try {
		const coupon = await stripe.coupons.create({
			percent_off: percent_off,
			duration: "forever",
			id: couponCode,
			currency: "usd"
		});
		console.log("Coupon created: ", coupon);
		return coupon;
	} catch (error) {
		console.error("Error creating coupon: ", error);
	}
}