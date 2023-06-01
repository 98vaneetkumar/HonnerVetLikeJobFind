const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
module.exports = {
	save: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				title: Joi.string().optional(),
				message: Joi.string().optional(),
				notificationType: Joi.string().optional(),	
				userType: Joi.number().valid(0,1,2,3,4,5,6).optional(),
				isRead: Joi.number().valid(0,1).optional(), 	
			});

			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "userId") && payloadData.userId !== "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "title") && payloadData.title !== "") objToSave.title = payload.title;
			if (_.has(payloadData, "message") && payloadData.message !== "") objToSave.message = payload.message;
			if (_.has(payloadData, "notificationType") && payloadData.notificationType !== "") objToSave.notificationType = payload.notificationType;
			if (_.has(payloadData, "userType")) objToSave.userType = payload.userType;
			if (_.has(payloadData, "isRead")) objToSave.isRead = payload.isRead;
			let create = await Services.AdminNotificationService.saveData(objToSave);
			if (create) {
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
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result = {};
			result.data = await Services.AdminNotificationService.getListing(
				payload,
				parseInt(payload.limit, 10) || 10,
				parseInt(payload.skip, 10) || 0
			);
			result.count = await Services.AdminNotificationService.count(payload);
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
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let detail = await Services.AdminNotificationService.getOne(criteria);
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
				userId: Joi.string().required(),
				title: Joi.string().optional(),
				message: Joi.string().optional(),
				notificationType: Joi.string().optional(),	
				userType: Joi.number().valid(0,1,2,3,4,5,6).optional(),
				isRead: Joi.number().valid(0,1).optional(), 
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {};
			if (_.has(payloadData, "userId") && payloadData.userId !== "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "title") && payloadData.title !== "") objToSave.title = payload.title;
			if (_.has(payloadData, "message") && payloadData.message !== "") objToSave.message = payload.message;
			if (_.has(payloadData, "notificationType") && payloadData.notificationType !== "") objToSave.notificationType = payload.notificationType;
			if (_.has(payloadData, "userType")) objToSave.userType = payload.userType;
			if (_.has(payloadData, "isRead")) objToSave.isRead = payload.isRead;
			if (_.has(payloadData, "isDeleted")) objToSave.isDeleted = payloadData.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToSave.isBlocked = payloadData.isBlocked;
			await Services.AdminNotificationService.updateData(criteria, objToSave);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
