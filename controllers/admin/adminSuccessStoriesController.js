const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
// var moment = require("moment");
let projection = ["id","uploadImage","name","designation","companyName","description","isBlocked","createdAt","updatedAt"];
module.exports = {
	save: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				uploadImage: Joi.string().optional(),
				name: Joi.string().optional(),
				designation: Joi.string().optional(),
				companyName: Joi.string().optional(),
				description: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "uploadImage") && payloadData.uploadImage !== "") objToSave.uploadImage = payload.uploadImage;
			if (_.has(payloadData, "name") && payloadData.name !== "") objToSave.name = payload.name;
			if (_.has(payloadData, "designation") && payloadData.designation !== "") objToSave.designation = payload.designation;
			if (_.has(payloadData, "companyName") && payloadData.companyName !== "") objToSave.companyName = payload.companyName;
			if (_.has(payloadData, "description") && payloadData.description !== "") objToSave.description = payload.description;
			let create = await Services.AdminSuccessStoriesService.saveData(objToSave);
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
			startDate: Joi.date().optional(),
			endDate: Joi.date().optional(),
		});
		// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
		// const fromDate = moment().subtract(7, "day").format("YYYY-MM-DD");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
		let orderBy = payload.orderBy ? payload.orderBy : "DESC";
		let isBlocked = payload.isBlocked ? payload.isBlocked : "0";
		let result= {};
		result.data = await Services.AdminSuccessStoriesService.getListing(
			payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0), sortBy, orderBy, isBlocked;
		result.count= 	await Services.AdminSuccessStoriesService.count(payload);
		return result;
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
			let detail = await Services.AdminSuccessStoriesService.getOne(criteria, projection);
			return detail;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	update: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			uploadImage: Joi.string().optional(),
			name: Joi.string().optional(),
			designation: Joi.string().optional(),
			companyName: Joi.string().optional(),
			description: Joi.string().optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let objToSave = {};
		if (_.has(payloadData, "uploadImage") && payloadData.uploadImage !== "") objToSave.uploadImage = payload.uploadImage;
		if (_.has(payloadData, "name") && payloadData.name !== "") objToSave.name = payload.name;
		if (_.has(payloadData, "designation") && payloadData.designation !== "") objToSave.designation = payload.designation;
		if (_.has(payloadData, "companyName") && payloadData.companyName !== "") objToSave.companyName = payload.companyName;
		if (_.has(payloadData, "description") && payloadData.description !== "") objToSave.description = payload.description;
		if (_.has(payloadData, "isDeleted")) objToSave.isDeleted = payloadData.isDeleted;
		if (_.has(payloadData, "isBlocked")) objToSave.isBlocked = payloadData.isBlocked;
		await Services.AdminSuccessStoriesService.updateData(criteria, objToSave);
		return message.success.UPDATED;
	}
};