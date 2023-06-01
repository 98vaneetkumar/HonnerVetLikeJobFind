const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
const NotificationManager = require("../../helpers/notificationManager");
let projection =["id","isBlocked","createdAt","title","startDate","message","userType","notificationStatus"];
module.exports = {
	save: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				title: Joi.string().optional(),
				message: Joi.string().optional(),
				startDate: Joi.date().optional(),
				schedule: Joi.string().optional(),
				userType: Joi.number().valid(0,1,2,3,4,5,6).optional(),
				notificationStatus: Joi.number().valid(0,1,2).optional(),
				notificationType: Joi.number().valid(0,1).optional(),
				description:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "title") && payloadData.title !== "") objToSave.title = payload.title;
			if (_.has(payloadData, "message") && payloadData.message !== "") objToSave.message = payload.message;
			if (_.has(payloadData, "startDate") && payloadData.startDate !== "") objToSave.startDate = payload.startDate;
			if (_.has(payloadData, "schedule") && payloadData.schedule !== "") objToSave.schedule = payload.schedule;
			if (_.has(payloadData, "description") && payloadData.description !== "") objToSave.description = payload.description;
			if (_.has(payloadData, "userType")) objToSave.userType = payload.userType;
			if (_.has(payloadData, "notificationStatus")) objToSave.notificationStatus = payload.notificationStatus;
			if (_.has(payloadData, "notificationType")) objToSave.notificationType = payload.notificationType;
			let create=await Services.AdminNotificationMessageService.saveData(objToSave);
			if(payload.notificationStatus&&payload.notificationStatus==1){
				await notificationSend(objToSave);
			}
			
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
				userType: Joi.number().optional(),
				// adminId: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result = {};
			result.count = await Services.AdminNotificationMessageService.count(payload);
			result.data = await Services.AdminNotificationMessageService.getListing(payload ,projection,parseInt(payload.limit, 10) || 10,parseInt(payload.skip, 10) || 0);
			
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
			let detail = await Services.AdminNotificationMessageService.getOne(criteria, projection);
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
				title: Joi.string().optional(),
				message: Joi.string().optional(),
				startDate: Joi.date().optional(),
				userType: Joi.number().valid(0,1,2,3,4,5,6).optional(),
				schedule : Joi.string().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
				notificationStatus: Joi.number().valid(0,1,2).optional(),
				notificationType: Joi.number().valid(0,1).optional(),
				description:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "title") && payloadData.title !== "") objToUpdate.title = payload.title;
			if (_.has(payloadData, "message") && payloadData.message !== "") objToUpdate.message = payload.message;
			if (_.has(payloadData, "startDate") && payloadData.startDate !== "") objToUpdate.startDate = payload.startDate;
			if (_.has(payloadData, "userType")) objToUpdate.userType = payload.userType;
			if (_.has(payloadData, "schedule") && payloadData.schedule !== "") objToUpdate.schedule = payload.schedule;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payloadData.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payloadData.isBlocked;
			if (_.has(payloadData, "notificationStatus")) objToUpdate.notificationStatus = payload.notificationStatus;
			if (_.has(payloadData, "description")) objToUpdate.description = payload.description;
			if (_.has(payloadData, "notificationType")) objToUpdate.notificationType = payload.notificationType;
			
			await Services.AdminNotificationMessageService.updateData(criteria, objToUpdate);
			if(payload.notificationType&&payload.notificationType==1){
				await notificationSend(objToUpdate);
			}
			
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};

let notificationSend=async(objToSave)=>{
	var getAllDeviceToken;
	if(objToSave.userType===0){ //0 for all like user IOS Android and web
		getAllDeviceToken = await Services.SessionsService.getSessionListAll(["userId","deviceToken", "deviceType" ], 50, 0);
	}
	else if(objToSave.userType===1){ // 1 For IOS user
		getAllDeviceToken = await Services.SessionsService.getSessionList({deviceType: "IOS"}, ["userId","deviceToken", "deviceType" ], 50, 0);
	}else if(objToSave.userType===2){ // 2 For Android user
		getAllDeviceToken = await Services.SessionsService.getSessionList({deviceType: "ANDROID"}, ["userId","deviceToken", "deviceType" ], 50, 0);
	}else if(objToSave.userType===3){   // 3 For Web user
		getAllDeviceToken = await Services.SessionsService.getSessionList({deviceType: "WEB"}, ["userId","deviceToken", "deviceType" ], 50, 0);
	}else if(objToSave.userType===4){   // 4 For recruiter
		getAllDeviceToken = await Services.SessionsService.getSessionListRecruiter({deviceType: "WEB"}, ["deviceToken","recruiterId" ], 50, 0);
	}else if(objToSave.userType===5){  // 5 For Sub Admin
		getAllDeviceToken = await Services.SessionsService.getSessionListSubAdmin({deviceType: "WEB"}, ["deviceToken","adminId" ], 50, 0);
	}
	var arrDeviceTokenIOS = [];
	var arrDeviceTokenANDRIOD = [];
	var arrDeviceTokenWEB = [];
	var objToSaveNotification;
	var saveNotification;
	getAllDeviceToken.forEach(async (element) => {
		if(element.deviceType == "IOS"){
			arrDeviceTokenIOS.push(element.deviceToken);
		}else if(element.deviceType == "ANDROID"){
			arrDeviceTokenANDRIOD.push(element.deviceToken); 
		}else if(element.deviceType == "WEB"){
			arrDeviceTokenWEB.push(element.deviceToken);
		}else{
			arrDeviceTokenWEB.push(element.deviceToken);
		}
		if(objToSave.userType==0||objToSave.userType==1||objToSave.userType==2||objToSave.userType==3){
			objToSaveNotification = {
				userId: element.userId,
				title:objToSave.title,
				message:objToSave.message,
				notificationType:objToSave.notificationType,
				userType: 0,
				deviceType: 0
			};
			saveNotification = await Services.UserNotificationService.saveData(objToSaveNotification);
		}
		else if(objToSave.userType==4){
			objToSaveNotification = {
				recruiterId: element.recruiterId,
				title:objToSave.title,
				message:objToSave.message,
				notificationType:objToSave.notificationType,
				description:objToSave.description,
				userType: 0,
				deviceType: 0
			};
			saveNotification = await Services.UserNotificationService.saveDataRecruiter(objToSaveNotification);
		}
	});
	var dataNotification ={
		title:objToSave.title,
		message:objToSave.message,
		notificationType:objToSave.notificationType.toString(),
		description:objToSave.description,
		flag:"1",
		notificationId : "1",
	};
	
	if(saveNotification){
		if(arrDeviceTokenANDRIOD && arrDeviceTokenANDRIOD.length > 0){
			await NotificationManager.sendNotificationAndroid(dataNotification, arrDeviceTokenANDRIOD);
		}
		if(arrDeviceTokenIOS && arrDeviceTokenIOS.length > 0){
			await NotificationManager.sendNotificationIos(dataNotification, arrDeviceTokenIOS);
		}
		if(arrDeviceTokenWEB && arrDeviceTokenWEB.length > 0){
			await NotificationManager.sendNotificationAll(dataNotification, arrDeviceTokenWEB);
		}
	}
};