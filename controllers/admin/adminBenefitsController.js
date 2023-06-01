const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
module.exports = {
	save: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				name: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "name") && payloadData.name != "")
				objToSave.name = payload.name;
			let create = await Services.BenefitsService.saveData(objToSave);
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
			result.data = await Services.BenefitsService.getListing(
				payload,
				parseInt(payload.limit, 10) || 10,
				parseInt(payload.skip, 10) || 0
			);
			result.count = await Services.BenefitsService.count(payload);
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
			let detail = await Services.BenefitsService.getOne(criteria);
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
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {};
			if (_.has(payloadData, "name") && payloadData.name != "")
				objToSave.name = payloadData.name;
			if (_.has(payloadData, "isDeleted"))
				objToSave.isDeleted = payloadData.isDeleted;
			if (_.has(payloadData, "isBlocked"))
				objToSave.isBlocked = payloadData.isBlocked;
			await Services.BenefitsService.updateData(criteria, objToSave);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
