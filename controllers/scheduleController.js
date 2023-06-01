//const _ = require("underscore");
// const Joi = require("joi");
// let commonHelper = require("../helpers/common");
//let message = require("../config/messages");
let Services = require("../services");
const moment = require("moment");
const NotificationManager = require("../helpers/notificationManager");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
// const Models = require("../models");

module.exports = {
	inNotActiveUserNotification: async(payloadData) => {
		// console.log(payloadData);
		let result= {};
		let criteria= {
			isDeleted:0,
			isBlocked:0,
			isEmailVerified:1,
			lastVisit: {
				[Op.lte]: moment().subtract(15, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss")
			}
		};
		let projectionUser = ["id", "name", "email", "isBlocked", "createdAt","lastVisit"];
		let userData = await Services.UserService.getAllListForLastVisit(criteria, projectionUser);
		Promise.all(userData.map(async(lv)=>{
			// let differenceOfDateInDays = moment(new Date()).diff(lv.lastVisit, "days") ;
			let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: lv.id}, ["deviceToken", "deviceType" ], 150, 0);
			var arrDeviceTokenIOS = [];
			var arrDeviceTokenANDRIOD = [];
			var arrDeviceTokenWEB = [];
			getAllDeviceToken.forEach(async (element) => {
				if(element.deviceType == "IOS"){
					arrDeviceTokenIOS.push(element.deviceToken);
				}else if(element.deviceType == "ANDROID"){
					arrDeviceTokenANDRIOD.push(element.deviceToken); 
				}else if(element.deviceType == "WEB"){
					arrDeviceTokenWEB.push(element.deviceToken);
				}
			});
			let objToSaveNotification = {
				userId: lv.id,
				title:"It has been noticed that you are not active from last few days",
				message:"It has been noticed that you are not active from last few days",
				notificationType:13,
				userType: 0,
				deviceType: 0
			};
			var dataNotification ={
				title:"It has been noticed that you are not active from last few days",
				message:"It has been noticed that you are not active from last few days",
				notificationType:"13",
				flag:"1",
				notificationId : "1",
			};
			let saveNotification = await Services.UserNotificationService.saveData(objToSaveNotification);
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
		}));
		
		return result;
	},
	updateResumeNotification: async(payloadData) => {
		// console.log(payloadData);
		let result= {};
		let criteria= {
			isDeleted:0,
			isBlocked:0,
			updatedAt: {
				[Op.lte]: moment().subtract(90, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss")
			}
		};
		let projectionUser = ["id","userId", "isBlocked", "createdAt","updatedAt"];
		let userData = await Services.UserService.getLastResumeUpdate(criteria, projectionUser);
		Promise.all(userData.map(async(lv)=>{
			// let differenceOfDateInDays = moment(new Date()).diff(lv.updatedAt, "days") ;
			let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: lv.userId}, ["deviceToken", "deviceType" ], 50, 0);
			var arrDeviceTokenIOS = [];
			var arrDeviceTokenANDRIOD = [];
			var arrDeviceTokenWEB = [];
			getAllDeviceToken.forEach(async (element) => {
				if(element.deviceType == "IOS"){
					arrDeviceTokenIOS.push(element.deviceToken);
				}else if(element.deviceType == "ANDROID"){
					arrDeviceTokenANDRIOD.push(element.deviceToken); 
				}else if(element.deviceType == "WEB"){
					arrDeviceTokenWEB.push(element.deviceToken);
				}
			});
			let objToSaveNotification = {
				userId: lv.userId,
				title:"Update Resume",
				message:"It's been a while since you have updated your resume, please update.",
				notificationType:14,
				userType: 0,
				deviceType: 0
			};
			var dataNotification ={
				title:"Update Resume",
				message:"It's been a while since you have updated your resume, please update.",
				notificationType:"14",
				flag:"1",
				notificationId : "1",
			};
			let saveNotification = await Services.UserNotificationService.saveData(objToSaveNotification);
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
		}));	
		return result;
	},
};