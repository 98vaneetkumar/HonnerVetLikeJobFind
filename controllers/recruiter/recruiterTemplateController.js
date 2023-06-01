const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let response = require("../../config/response");
let Services = require("../../services");
module.exports = {
	save: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				subject: Joi.string().optional(),
				description: Joi.string().optional(),
				recruiterId:Joi.required(),
				action: Joi.number().valid(0,1,2,3,4).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "subject") && payloadData.subject != "") objToSave.subject = payload.subject;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "action")) {
				let existingTemplate = await Services.RecruiterTemplateService.getListing({ action: payload.action });
				if (existingTemplate && existingTemplate.length > 0 && existingTemplate[0].action === payload.action) {
					throw response.error_msg.alreadyExistTemplateAction;
				} else {
					objToSave.action = payload.action;
				}
			}
			objToSave.recruiterId=payload.recruiterId;
			let create = await Services.RecruiterTemplateService.saveData(objToSave);
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
				recruiterId:Joi.required(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result = {};
			result.count = await Services.RecruiterTemplateService.count(payload);
			result.data = await Services.RecruiterTemplateService.getListing(
				payload,
				parseInt(payload.limit, 10) || 10,
				parseInt(payload.skip, 10) || 0
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
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let detail = await Services.RecruiterTemplateService.getOne(criteria);
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
				subject: Joi.string().optional(),
				description: Joi.string().optional(),
				action: Joi.number().valid(0,1,2,3,4).optional(),
				isBlocked: Joi.number().valid(0,1).optional(),
				isDeleted: Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {};
			if (_.has(payloadData, "subject") && payloadData.subject != "") objToSave.subject = payload.subject;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "isDeleted"))objToSave.isDeleted = payloadData.isDeleted;
			if (_.has(payloadData, "isBlocked"))objToSave.isBlocked = payloadData.isBlocked;
			await Services.RecruiterTemplateService.updateData(criteria, objToSave);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
