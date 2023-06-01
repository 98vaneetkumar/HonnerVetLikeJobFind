const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
module.exports = {
	save: async(payloadData) => {
		const schema = Joi.object().keys({
			name: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToSave = {};
		if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
		let create = await Services.SpecializationService.saveData(objToSave);
		if (create) {
			return message.success.ADDED;
		}
	},
	getList: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.data = await Services.SpecializationService.getListing(
			payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.SpecializationService.count(payload);
		return result;
	},
	getDetail: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let detail = await Services.SpecializationService.getOne(criteria);
		return detail;
	},
	update: async(payloadData) => {
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
		if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payloadData.name;
		if (_.has(payloadData, "isDeleted") ) objToSave.isDeleted = payloadData.isDeleted;
		if (_.has(payloadData, "isBlocked") ) objToSave.isBlocked = payloadData.isBlocked;
		await Services.SpecializationService.updateData(criteria, objToSave);
		return message.success.UPDATED;
	},
};