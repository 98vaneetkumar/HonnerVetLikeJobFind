const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const Services = require("../../services");
const Sequelize = require("sequelize");
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
			let create = await Services.UserNotificationService.saveData(objToSave);
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
				userId: Joi.string().required(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let projection=["id","isBlocked", "createdAt","updatedAt", "userId","title","message","userType","isRead","notificationType","recruiterId","jobId",
				[Sequelize.literal("(SELECT (users.profileImage) FROM users as users where users.id=userId)"), "profileImageUser"],
				[Sequelize.literal("(SELECT (recruiter.profileImage) FROM recruiter as recruiter where recruiter.id= notifications.recruiterId)"), "companyProfile"],
				[Sequelize.literal("(SELECT if(count(id)>0,1,0) FROM user_turn_off_notification where notifications.recruiterId=user_turn_off_notification.recruiterId limit 1 )"), "notificationTurnOff"]
		
			];
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result = {};
			result.count = await Services.UserNotificationService.count(payload);
			result.unreadCount = await Services.UserNotificationService.unreadCount(payload);
			result.data = await Services.UserNotificationService.getListing(
				payload,projection,
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
			let projection=["id","isBlocked", "createdAt","updatedAt", "userId","title","message","userType","isRead","notificationType","recruiterId","jobId",
				[Sequelize.literal("(SELECT (users.profileImage) FROM users as users where users.id=userId)"), "profileImageUser"],
				[Sequelize.literal("(SELECT (recruiter.profileImage) FROM recruiter as recruiter where recruiter.id= notifications.recruiterId)"), "companyProfile"],
				[Sequelize.literal("(SELECT if(count(id)>0,1,0) FROM user_turn_off_notification where notifications.recruiterId=user_turn_off_notification.recruiterId limit 1 )"), "notificationTurnOff"]
			];
			console.timeLog(projection);
			console.log(projection);
			let detail = await Services.UserNotificationService.getOne(criteria,projection);
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
				isRead: Joi.number().valid(0,1,2).required(), 
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {};
			if(payload.isRead===0||payload.isRead===1){
				if (_.has(payloadData, "isRead")) objToSave.isRead = payload.isRead;
				await Services.UserNotificationService.updateData(criteria, objToSave);
			}else if(payload.isRead&&payload.isRead===2){
				if (_.has(payloadData, "isRead")) objToSave.isRead = 1;
				let criteria1={
					userId:payload.userId
				};
				await Services.UserNotificationService.updateData(criteria1, objToSave);
			}
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
