const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const Services = require("../../services");
module.exports = {
	save: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().optional(),
				recruiterId:Joi.string().optional(),
				status: Joi.number().valid(0, 1).optional().allow(""),	
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			let criteria={
				userId:payload.userId,
				recruiterId:payload.recruiterId
			};
			objToSave.userId = payloadData.userId;
			if (_.has(payloadData, "recruiterId") && payloadData.recruiterId !== "") objToSave.recruiterId = payload.recruiterId;
			if(payload&&payload.status===0){
				await Services.UserTurnOffNotificationService.saveData(objToSave);
			}else if(payload&&payload.status===1){
				await Services.UserNotificationService.hardDelete(criteria); 
			}
			
			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	delete: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				userId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
				userId:payloadData.userId
			};
			await Services.UserNotificationService.hardDelete(criteria); 
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
