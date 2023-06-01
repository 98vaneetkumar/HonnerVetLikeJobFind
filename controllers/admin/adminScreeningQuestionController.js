const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
module.exports = {
	save: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				title: Joi.string().optional(),
				question: Joi.string().optional(),
				responseType: Joi.number().valid(0,1).optional(),
				answer: Joi.string().optional()

			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "title") && payloadData.title !== "") objToSave.title = payload.title;
			if (_.has(payloadData, "question") && payloadData.question !== "") objToSave.question = payload.question;
			if (_.has(payloadData, "answer") && payloadData.answer !== "") objToSave.answer = payload.answer;
			if (_.has(payloadData, "responseType")) objToSave.responseType = payload.responseType;
			let create = await Services.AdminScreeningQuestionService.saveData(objToSave);
			if (create) {
				return message.success.ADDED;
			}
		}
		catch (err) {
			console.log(err);
			throw err;
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
		result.data = await Services.AdminScreeningQuestionService.getListing(
			payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.AdminScreeningQuestionService.count(payload);
		return result;
	},
	
	update: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			title: Joi.string().optional(),
			question: Joi.string().optional(),
			responseType: Joi.number().valid(0,1).optional(),
			answer: Joi.string().optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let objToSave = {};
		if (_.has(payloadData, "title") && payloadData.title !== "") objToSave.title = payloadData.title;
		if (_.has(payloadData, "question") && payloadData.question !== "") objToSave.question = payloadData.question;
		if (_.has(payloadData, "answer") && payloadData.answer !== "") objToSave.answer = payloadData.answer;
		if (_.has(payloadData, "responseType") ) objToSave.responseType = payloadData.responseType;
		if (_.has(payloadData, "isDeleted")) objToSave.isDeleted = payloadData.isDeleted;
		if (_.has(payloadData, "isBlocked") ) objToSave.isBlocked = payloadData.isBlocked;
		await Services.AdminScreeningQuestionService.updateData(criteria, objToSave);
		return message.success.UPDATED;
	}
};