const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../helpers/common");
const Response = require("../config/response");
let message = require("../config/messages");
let Services = require("../services");
const Models = require("../models");

module.exports = {
	getAppVersionByPlatform: async (paramData) => {
		const schema = Joi.object().keys({
			platform: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			name: payload.platform.toUpperCase(),
		};
		let projection = ["name", "version", "minimumVersion"];
		return await Services.BaseService.getSingleRecord(Models.AppVersion, criteria, projection);
	},
	
	getAppVersionById: async (paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			id: payload.id,
		};
		let projection = ["id", "name", "version", "minimumVersion"];
		return await Services.BaseService.getAllRecords(Models.AppVersion, criteria, projection);
	},
	saveAppVersion: async (payloadData) => {
		const schema = Joi.object().keys({
			name: Joi.string().max(100).optional(),
			version: Joi.string().max(100).optional(),
			minimumVersion: Joi.string().max(100).optional()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToSave = {};
		if (_.has(payload, "name") && payload.name != "") objToSave.name = payload.name.toUpperCase();
		if (_.has(payload, "version") && payload.version != "") objToSave.version = payload.version;
		if (_.has(payload, "minimumVersion") && payload.minimumVersion != "") objToSave.minimumVersion = payload.minimumVersion;
		let criteria = {
			name: payload.name.toUpperCase(),
			isDeleted: 0
		};
		let projection = ["id"];
		let service = await Services.BaseService.getSingleRecord(Models.AppVersion, criteria, projection);
		if (!service) {
			await Services.BaseService.saveData(objToSave);
		}
		else throw Response.error_msg.nameAlreadyExist;
	},
	updateAppVersion: async (payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			name: Joi.string().optional(),
			version: Joi.string().optional(),
			minimumVersion: Joi.string().optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let objToSave = {};
		if (_.has(payload, "name") && payload.name != "") objToSave.name = payload.name.toUpperCase();
		if (_.has(payload, "version") && payload.version != "") objToSave.version = payload.version;
		if (_.has(payload, "minimumVersion") && payload.minimumVersion != "") objToSave.minimumVersion = payload.minimumVersion;
		if (_.has(payloadData, "isDeleted") && payloadData.isDeleted != "") objToSave.isDeleted = payload.isDeleted;
		if (payload && payload.name) {
			let criteriaAlreadyExists = {
				name: payload.name.toUpperCase(),
				isDeleted: 0
			};
			let projection = ["id"];
			let service = await Services.BaseService.getSingleRecord(Models.AppVersion, criteriaAlreadyExists, projection);
			if (!service) {
				await Services.BaseService.updateData(Models.AppVersion, criteria, objToSave);
			} else if (service.id == payload.id) {
				await Services.BaseService.updateData(Models.AppVersion, criteria, objToSave);
			}
			else throw Response.error_msg.nameAlreadyExist;
		} else {
			await Services.BaseService.updateData(Models.AppVersion, criteria, objToSave);
		}
	},
	deleteAppVersion: async (payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let objToSave = {};
		objToSave.isDeleted = payloadData.isDeleted;
		let updateAppVersion = await Services.BaseService.updateData(Models.AppVersion, criteria, objToSave);
		if (updateAppVersion) {
			return message.success.DELETED;
		}
	}
};
