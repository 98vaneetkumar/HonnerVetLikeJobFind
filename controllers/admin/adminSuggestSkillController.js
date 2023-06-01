const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
const Response = require("../../config/response");
module.exports = {
	save: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				name: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
			let checkrecordExist= await Services.SuggestSkillsService.getOne(objToSave);
			if(!checkrecordExist){
				let create = await Services.SuggestSkillsService.saveData(objToSave);
				if (create) {
					return message.success.ADDED;
				}
			}
			else{
				throw Response.error_msg.ALREADY_EXISTS_SUGGESTED_SKILL;
			}
		}catch (err){
			console.log(err);
			throw err;
		}	
	},
	getList: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			result.data = await Services.SuggestSkillsService.getListing(
				payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.count= 	await Services.SuggestSkillsService.count(payload);
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	getDetail: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let detail = await Services.SuggestSkillsService.getOne(criteria);
			return detail;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	update: async(payloadData) => {
		try{
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
			let objToUpdate = {};
			if (_.has(payloadData, "name") && payloadData.name != "") objToUpdate.name = payload.name;
			if (_.has(payloadData, "isDeleted") && payloadData.isDeleted != "") objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			await Services.SuggestSkillsService.updateData(criteria, objToUpdate);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
};