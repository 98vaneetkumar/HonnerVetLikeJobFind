const _ = require("underscore");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
var fs = require("fs");
const moment = require("moment");
const commonHelper = require("../../helpers/common");
const response = require("../../config/response");
const Services = require("../../services");
const TokenManager = require("../../helpers/tokenManager");
const env = require("../../config/env")();
const Mailer = require("../../helpers/mailer");
const NotificationManager = require("../../helpers/notificationManager");
const Models = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const PRIVATE_KEY = env.APP_URLS.PRIVATE_KEY;
var https = require("https");



var generateToken = async (userId, email, userType, platform, sessionData) => {
	try {
		let tokenData = {
			email: email,
			id: userId,
			userType: userType,
			platform: platform
		};
		let projection = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
			"gender", "serviceDisabled","veteranRelationDocumentLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
		];

		let userData = await Services.UserService.getDetail({ id: userId }, projection, true);
		let userResumeStatus = await Services.UserBuildResumeService.getByIdResumeStatus({ userId: userId });
		let token = await Jwt.sign(tokenData, PRIVATE_KEY);
		await TokenManager.setTokenInDB(userId, sessionData, token);
		let response = userData.dataValues;
		response.accessToken = token;
		response.s3Folders = env.AWS.S3;
		response.userResumeStatus = userResumeStatus;
		return response;

	} catch (err) {
		console.log(err);
		throw err;
	}
};

var emailVerification = async (userId) => {
	try {
		let generatedString = await commonHelper.generateRandomNumbers(4);
		let otp = await commonHelper.generateRandomNumbers(4);
		// let otp = 1111;
		let criteria = {
			id: userId,
			isBlocked:"0",
			isDeleted:"0"
		};
		let projection = ["id", "name", "email", "isEmailVerified", "countryCode", "phoneNumber"];
		let userData = await Services.UserService.getDetail(criteria, projection);

		if (!userData) throw Response.error_msg.InvalidID;
		let objToSave = {};
		objToSave.emailVerificationToken = generatedString;
		objToSave.otp = otp;
		await Services.UserService.updateData(criteria, objToSave);
		let path = "/api/v1/user/verifyEmail?token=";
		let logoImage = "logo.png";
		var variableDetails = {
			name: userData.name,
			verificationUrl: env.APP_URLS.API_URL + path + generatedString,
			otp: otp,
			s3Url: env.AWS.S3.s3Url,
			ip: env.APP_URLS.API_URL,
			termsUrl: env.PAGESURL.termsUrl, 
			privacyUrl: env.PAGESURL.privacyUrl
		};
		// console.log(variableDetails);
		await Mailer.sendMail("REGISTER_USER", userData.email, variableDetails);
		return true;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = {
	registerUser: async (payloadData) => {
		const schema = Joi.object().keys({
			name: Joi.string().optional().allow(""),
			email: Joi.string().email().required().allow(""),
			facebookId: Joi.string().optional().allow(""),
			gmailId: Joi.string().optional().allow(""),
			appleId: Joi.string().optional().allow(""),
			userType: Joi.number().valid(0, 1).required().allow(""),
			veteranRelationName: Joi.string().valid("", "spouse", "child", "parents").optional(),
			veteranRelationType: Joi.number().valid(0,1, 2, 3).description("0 => veteran, 1 => Spouse, 2 =>Child, 3=> Parents").optional(),
			deviceToken: Joi.string().required().allow(""),
			platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
			loginType: Joi.number().valid(1, 2, 3,4).description("1 => email, 2 => fb, 3 =>gmail, 4=> apple").required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objSave = {};
		let projection = ["id", "email", "isBlocked", "isEmailVerified", "loginType"];
		let criteria = {};

		if (payload.loginType === 1) {
			if (!payload.email) throw response.error_msg.EMPTY_VALUE;
			criteria.email = payload.email;
		}else if (payload.loginType === 2) {
			if (!payload.facebookId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { facebookId: payload.facebookId }]
				};
			} else {
				criteria.facebookId = payload.facebookId;
			}
			objSave.isEmailVerified= 1;
		}else if (payload.loginType === 3) {
			if (!payload.gmailId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { googleId: payload.gmailId }]
				};
			} else {
				criteria.googleId = payload.gmailId;
			}
			objSave.isEmailVerified= 1;
		}else if (payload.loginType === 4) {
			if (!payload.appleId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { appleId: payload.appleId }]
				};
			} else {
				criteria.appleId = payload.appleId;
			}
			objSave.isEmailVerified= 1;
		}
		criteria.isEmailVerified =1;
		criteria.isDeleted =0;
		if (_.has(payloadData, "name") && payloadData.name != "") objSave.name = payload.name;
		if (_.has(payloadData, "email") && payloadData.email != "") objSave.email = payload.email;
		if (_.has(payloadData, "facebookId") && payloadData.facebookId != "") objSave.facebookId = payload.facebookId;
		if (_.has(payloadData, "gmailId") && payloadData.gmailId != "") objSave.googleId = payload.gmailId;
		if (_.has(payloadData, "appleId") && payloadData.appleId != "") objSave.appleId = payload.appleId;
		if (_.has(payloadData, "deviceToken") && payloadData.deviceToken != "") objSave.deviceToken = payload.deviceToken;
		if (_.has(payloadData, "platformType") && payloadData.platformType != "") objSave.platformType = payload.platformType;
		// if (_.has(payloadData, "veteranRelationName") && payloadData.veteranRelationName != "") objSave.veteranRelationName = payload.veteranRelationName;
		if (_.has(payloadData, "veteranRelationType") && payloadData.veteranRelationType != "") objSave.veteranRelationType = payload.veteranRelationType;
		if (_.has(payloadData, "userType")) objSave.userType = payload.userType;
		objSave.loginType = payload.loginType;
		objSave.lastVisit = new Date();
		let userData = await Services.UserService.getDetail(criteria, projection);
		if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
		if (userData && userData.id) {
			if( payload.loginType ===1 && userData.dataValues.loginType === 1){
				// console.log("case1")
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else if(payload.loginType ===1 && userData.dataValues.loginType !== 1){
				// console.log("case2")
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else if(payload.loginType ===2 && userData.dataValues.loginType !== 2){
				// console.log("case3")
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else if(payload.loginType ===3 && userData.dataValues.loginType !== 3){
				// console.log("case4")
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else if(payload.loginType ===4 && userData.dataValues.loginType !== 4){
				// console.log("case5")
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}
		}
		let createUser;
		if (!userData) {
			if (payload.email) {
				let criteriaDelete = {
					"isDeleted": "0",
					"isEmailVerified": "0",
					"email": payload.email
				};
				await Services.UserService.deleteUserDelete(criteriaDelete);
			}
			createUser = await Services.UserService.saveData(objSave);
			await Services.UserBuildResumeService.saveResumeStatus({userId: createUser.id});
			if (createUser && payload.loginType ===1) {
				await emailVerification(createUser.id);
			}
		}else{
			let userCriteria = {
				id: userData.id,
			};
			createUser = await Services.UserService.getDetail(userCriteria, ["id"]);
		}
		let sessionData = {
			id: createUser.id,
			deviceToken: payload.deviceToken,
			deviceType: payload.platformType
		};
		return await generateToken(createUser.id, payload.email, payload.userType, payload.platformType, sessionData);

	},
	verifyOtp: async(payloadData) =>{
		const schema = Joi.object().keys({
			otp: Joi.string().required().allow(""),               
			tokenId: Joi.string().required(), 
			isType:Joi.number().valid(0,1).optional()              
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			"id": payload.tokenId,
			"otp":payload.otp,
			"isDeleted": "0",
			"isBlocked": "0"
		};
		let projectionUser = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified", "otp",
			"gender", "serviceDisabled", "veteranRelationDocumentLink","veteranRelationName","veteranRelationType","personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
		];      
      
		let userData = await Services.UserService.getDetail(criteria, projectionUser);
		if (!userData) throw response.error_msg.invalidOtp;
		let verifyOtpData = await Services.UserService.updateData(criteria, { otp: null, isEmailVerified: "1", });
		let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: payload.tokenId}, ["deviceToken", "deviceType" ], 50, 0);
		if (verifyOtpData && payload.isType===1) {
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
				userId: userData.id,
				title:"Welcome to the HonorVet Hiring App",
				message:"Welcome to the HonorVet App on your successful registration",
				notificationType:1,
				userType: 0,
				deviceType: 0
			};
			var dataNotification ={
				title:"Welcome to the HonorVet Hiring App",
				message:"Welcome to the HonorVet App on your successful registration",
				notificationType:"1",
				flag:"1",
				notificationId : "1",
			};
			let create = await Services.UserNotificationService.saveData(objToSaveNotification);
			if(create){
				if(arrDeviceTokenANDRIOD.length > 0){
					await NotificationManager.sendNotificationAndroid(dataNotification, arrDeviceTokenANDRIOD);
				}
				if(arrDeviceTokenIOS.length > 0){
					await NotificationManager.sendNotificationIos(dataNotification, arrDeviceTokenIOS);
				}
				if(arrDeviceTokenWEB && arrDeviceTokenWEB.length > 0){
					await NotificationManager.sendNotificationAll(dataNotification, arrDeviceTokenWEB);
				}
			}
			
		}

		return response.STATUS_MSG.SUCCESS.DEFAULT;
	},
	setUserPassword: async(payloadData) =>{
		const schema = Joi.object().keys({
			password: Joi.string().required(),             
			tokenId: Joi.string().required(),               
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objSave = {};
		if (_.has(payloadData, "password") && payloadData.name != ""){
			let password = await commonHelper.encrypt(payload.password);
			objSave.password = password;
		}
		let criteria = {
			"id": payload.tokenId,
			"isEmailVerified": "1",
			"isDeleted": "0",
			"isBlocked": "0"
		};
		let projectionUser = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified", "otp",
			"gender", "serviceDisabled", "veteranRelationDocumentLink","veteranRelationName","veteranRelationType","personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
		];            
		let userData = await Services.UserService.getDetail(criteria, projectionUser);
		if (!userData) throw response.error_msg.InvalidID;
		await Services.UserService.updateData(criteria, objSave);
		return response.STATUS_MSG.SUCCESS.DEFAULT; 
	},
	resendSignUpOtp: async(payloadData) =>{
		const schema = Joi.object().keys({
			tokenId: Joi.string().required(),               
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		return await emailVerification(payload.tokenId);
	},
	loginUser: async(payloadData) =>{
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().required(),
				password: Joi.string().required(),
				ipAddress: Joi.string().required().allow(""),
				platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
				deviceToken: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"email": payload.email,
				"isDeleted": "0",
				"isEmailVerified": "1",
				"loginType": "1",
			};
			let projectionUser = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "password", "isEmailVerified", "isPhoneVerified", "otp",
				"gender", "serviceDisabled","veteranRelationDocumentLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
			];           
			let userData = await Services.UserService.getDetail(criteria, projectionUser);
			if (!userData) throw response.error_msg.emailAndPasswordNotFound;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			if (userData && userData.isEmailVerified === 0) throw response.error_msg.emailAndPasswordNotFound;
			let password = await commonHelper.encrypt(payload.password);
			if (userData && userData.password !== password) throw response.error_msg.passwordNotMatch;
			let sessionData = {
				id: userData.id,
				deviceToken: payload.deviceToken,
				deviceType: payload.platformType
			};
			let variableDetails={
				name:userData.name,
				deviceName:payload.platformType,
				loginDate: moment().utc().format("YYYY-MM-DD HH:mm"),
				s3Url: env.AWS.S3.s3Url,
				ipAddress:payload.ipAddress,
				termsUrl: env.PAGESURL.termsUrl, 
				privacyUrl: env.PAGESURL.privacyUrl
			};
			await Mailer.sendMail("EMAIL_NOTIFICATION", userData.email, variableDetails);
			return await generateToken(userData.id, payload.email, 0, payload.platformType, sessionData);
		}catch (err) {
			console.log("err", err);
			throw err;
		}
	},
	oauthSocialLogin_old: async(payloadData) =>{
		const schema = Joi.object().keys({
			email: Joi.string().email().optional().allow(""),
			facebookId: Joi.string().optional().allow(""),
			gmailId: Joi.string().optional().allow(""),
			appleId: Joi.string().optional().allow(""),
			deviceToken: Joi.string().required().allow(""),
			platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
			loginType: Joi.number().valid(2, 3,4).description("2 => fb, 3 =>gmail, 4=> apple").required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		//let projection = ["id", "email", "isBlocked", "isEmailVerified", "loginType"];
		let criteria = {};
		let objSave = {};

		if (payload.loginType === 1) {
			if (!payload.email) throw response.error_msg.EMPTY_VALUE;
			criteria.email = payload.email;
		}else if (payload.loginType === 2) {
			if (!payload.facebookId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { facebookId: payload.facebookId }]
				};
			} else {
				criteria.facebookId = payload.facebookId;
			}
		}else if (payload.loginType === 3) {
			if (!payload.gmailId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { googleId: payload.gmailId }]
				};
			} else {
				criteria.googleId = payload.gmailId;
			}
		}else if (payload.loginType === 4) {
			if (!payload.appleId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { appleId: payload.appleId }]
				};
			} else {
				criteria.appleId = payload.appleId;
			}
		}
		objSave.isEmailVerified =1;
		criteria.isEmailVerified =1;
		criteria.isDeleted =0;
		
		if (_.has(payloadData, "name") && payloadData.name != "") objSave.name = payload.name;
		if (_.has(payloadData, "email") && payloadData.email != "") objSave.email = payload.email;
		if (_.has(payloadData, "facebookId") && payloadData.facebookId != "") objSave.facebookId = payload.facebookId;
		if (_.has(payloadData, "gmailId") && payloadData.gmailId != "") objSave.gmailId = payload.gmailId;
		if (_.has(payloadData, "appleId") && payloadData.appleId != "") objSave.appleId = payload.appleId;
		if (_.has(payloadData, "deviceToken") && payloadData.deviceToken != "") objSave.deviceToken = payload.deviceToken;
		if (_.has(payloadData, "platformType") && payloadData.platformType != "") objSave.platformType = payload.platformType;
		objSave.loginType = payload.loginType;

		let projectionUser = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "password", "isEmailVerified", "isPhoneVerified", "otp",
			"gender", "serviceDisabled","veteranRelationDocumentLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
		];            
		let userData = await Services.UserService.getDetail(criteria, projectionUser);
		if (!userData){
			if (payload.email) {
				let criteriaDelete = {
					"isDeleted": "0",
					"isEmailVerified": "0",
					"email": payload.email
				};
				await Services.UserService.deleteUserDelete(criteriaDelete);
			}
			let	createUser = await Services.UserService.saveData(objSave);
			let sessionData = {
				id: createUser.id,
				deviceToken: payload.deviceToken,
				deviceType: payload.platformType
			};
			return await generateToken(createUser.id, payload.email, 0, payload.platformType, sessionData);
		} 
		if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
		if (userData && userData.id) {
			if(payload.loginType ===2 && userData.dataValues.loginType !== 2){
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else if(payload.loginType ===3 && userData.dataValues.loginType !== 3){
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else if(payload.loginType ===4 && userData.dataValues.loginType !== 4){
				if(userData.dataValues.loginType ===2){
					throw response.error_msg.ALREADY_EXISTS_FACCBOOK;
				}else if(userData.dataValues.loginType ===3){
					throw response.error_msg.ALREADY_EXISTS_GMAIL;
				}else if(userData.dataValues.loginType ===4){
					throw response.error_msg.ALREADY_EXISTS_APPLE;
				}else{
					throw response.error_msg.alreadyExist;
				}
			}else{
				let sessionData = {
					id: userData.id,
					deviceToken: payload.deviceToken,
					deviceType: payload.platformType
				};
				return await generateToken(userData.id, payload.email, 0, payload.platformType, sessionData); 
			}
		}
		
	},
	oauthSocialLogin: async(payloadData) =>{
		const schema = Joi.object().keys({
			email: Joi.string().email().optional().allow(""),
			facebookId: Joi.string().optional().allow(""),
			gmailId: Joi.string().optional().allow(""),
			appleId: Joi.string().optional().allow(""),
			ipAddress: Joi.string().optional().allow(""),
			deviceToken: Joi.string().required().allow(""),
			userType: Joi.number().valid(0, 1).optional().allow(""),
			veteranRelationName: Joi.string().valid("", "spouse", "child", "parents").optional(),
			veteranRelationType: Joi.number().valid(0,1, 2, 3).description("0 => veteran, 1 => Spouse, 2 =>Child, 3=> Parents").optional(),
			platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
			loginType: Joi.number().valid(2, 3,4).description("2 => fb, 3 =>gmail, 4=> apple").required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		//let projection = ["id", "email", "isBlocked", "isEmailVerified", "loginType"];
		let criteria = {};
		let objSave = {};

		if (payload.loginType === 1) {
			if (!payload.email) throw response.error_msg.EMPTY_VALUE;
			criteria.email = payload.email;
		}else if (payload.loginType === 2) {
			if (!payload.facebookId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { facebookId: payload.facebookId }]
				};
			} else {
				criteria.facebookId = payload.facebookId;
			}
		}else if (payload.loginType === 3) {
			if (!payload.gmailId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email) {
				criteria = {
					[Op.or]: [{ email: payload.email }, { googleId: payload.gmailId }]
				};
			} else {
				criteria.googleId = payload.gmailId;
			}
		}else if (payload.loginType === 4) {
			if (!payload.appleId) throw response.error_msg.EMPTY_VALUE;
			if (payload.email && payload.email !=="") {
				criteria = {
					[Op.or]: [{ email: payload.email }, { appleId: payload.appleId }]
				};
			} else {
				criteria.appleId = payload.appleId;
			}
		}
		objSave.isEmailVerified =1;
		criteria.isEmailVerified =1;
		criteria.isDeleted =0;
		
		if (_.has(payloadData, "name") && payloadData.name != "") objSave.name = payload.name;
		if (_.has(payloadData, "email") && payloadData.email != "") objSave.email = payload.email;
		if (_.has(payloadData, "facebookId") && payloadData.facebookId != "") objSave.facebookId = payload.facebookId;
		if (_.has(payloadData, "gmailId") && payloadData.gmailId != "") objSave.googleId = payload.gmailId;
		if (_.has(payloadData, "appleId") && payloadData.appleId != "") objSave.appleId = payload.appleId;
		if (_.has(payloadData, "deviceToken") && payloadData.deviceToken != "") objSave.deviceToken = payload.deviceToken;
		if (_.has(payloadData, "platformType") && payloadData.platformType != "") objSave.platformType = payload.platformType;
		// if (_.has(payloadData, "veteranRelationName") && payloadData.veteranRelationName != "") objSave.veteranRelationName = payload.veteranRelationName;
		if (_.has(payloadData, "veteranRelationType") && payloadData.veteranRelationType != "") objSave.veteranRelationType = payload.veteranRelationType;
		if (_.has(payloadData, "userType")) objSave.userType = payload.userType;
		objSave.loginType = payload.loginType;
		objSave.lastVisit = new Date();

		let projectionUser = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "password", "isEmailVerified", "isPhoneVerified", "otp",
			"gender", "serviceDisabled","veteranRelationDocumentLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
		];            
		let userData = await Services.UserService.getDetail(criteria, projectionUser);
		if (!userData){
			if (payload.email) {
				let criteriaDelete = {
					"isDeleted": "0",
					"isEmailVerified": "0",
					"email": payload.email
				};
				await Services.UserService.deleteUserDelete(criteriaDelete);
			}
			let	createUser = await Services.UserService.saveData(objSave);
			let sessionData = {
				id: createUser.id,
				deviceToken: payload.deviceToken,
				deviceType: payload.platformType
			};
			await Services.UserBuildResumeService.saveResumeStatus({userId: createUser.id});
			return await generateToken(createUser.id, payload.email, 0, payload.platformType, sessionData);
		} 
		if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
		if (userData && userData.id) {
			delete objSave.email;
			delete objSave.loginType;
			delete objSave.deviceToken;
			delete objSave.platformType;
			let sessionData = {
				id: userData.id,
				deviceToken: payload.deviceToken,
				deviceType: payload.platformType
			};
			let variableDetails={
				name:userData.name,
				deviceName:payload.platformType,
				loginDate: moment().utc().format("YYYY-MM-DD HH:mm"),
				s3Url: env.AWS.S3.s3Url,
				ipAddress:payload.ipAddress,
				termsUrl: env.PAGESURL.termsUrl, 
				privacyUrl: env.PAGESURL.privacyUrl
			};
			await Mailer.sendMail("EMAIL_NOTIFICATION", userData.email, variableDetails);
			await Services.UserService.updateData({id:userData.id}, objSave);
			return await generateToken(userData.id, payload.email, 0, payload.platformType, sessionData); 
		}
		
	},
	forgotPassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().required().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = { "isDeleted": 0, "isBlocked": 0, "isEmailVerified": 1, "loginType":1 };
			if (payload.email) {
				criteria.email = payload.email;
			}
			let userData = await Services.UserService.getDetail(criteria, ["id", "name", "email"]);
			if (!userData) throw response.error_msg.emailNotFound;
			// if (!userData) throw response.error_msg.emailNotVerified;
			let generatedString = await commonHelper.generateRandomNumbers(6);
			let newToken = await commonHelper.encrypt(generatedString);
			let otp = await commonHelper.generateRandomNumbers(4);
			if (payload.email) {
				let path = "/api/v1/user/generatePassword?email=" + userData.email + "&token=";
				let logoImage = "logo.png";
				var variableDetails = {
					name: userData.name,
					otp: otp,
					s3logo: env.AWS.S3.s3Url+logoImage,
					ip: env.APP_URLS.API_URL,
					resetPasswordToken: env.APP_URLS.API_URL + path + generatedString,
					termsUrl: env.PAGESURL.termsUrl, 
					privacyUrl: env.PAGESURL.privacyUrl
				};
				await Mailer.sendMail("FORGOT_PASSWORD", userData.email, variableDetails);
				await Services.UserService.updateData(criteria, { forgotPasswordOtp: otp,  forgotPasswordToken: newToken });
				return response.STATUS_MSG.SUCCESS.DEFAULT;
			}else{
				return false;
			} 
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	resetPassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().required(),
				newPassword: Joi.string().required(),
				token: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let encryptedToken = await commonHelper.encrypt(payload.token);
			let userData = await Services.UserService.getDetail({ isDeleted: 0, forgotPasswordToken: encryptedToken, email:payload.email }, ["id", "email"]);
			if (!userData) throw response.error_msg.InvalidPasswordToken;
			let criteria = {
				id: userData.id,
			};
			let password = await commonHelper.encrypt(payload.newPassword);
			await Services.UserService.updateData(criteria, {
				password: password,
				forgotPasswordToken: null,
			});
			return {};
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	validateToken: async (payloadData) => {
		const schema = Joi.object().keys({
			token: Joi.string().required(),
			email: Joi.string().email().required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		if (!payload || !payload.token) {
			throw response.error_msg.implementationError;
		} else {
			let criteria = {
				email: payload.email || "",
				isDeleted: 0,
			};
			let newToken = await commonHelper.encrypt(payload.token);
			criteria.forgotPasswordToken = newToken;
			let userData = await Services.UserService.getDetail(criteria, ["id", "name", "email"]);
			if (!userData) throw response.error_msg.emailNotFound;
			return userData;
		}
	},
	
	changePassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				newPassword: Joi.string().min(5).required(),
				oldPassword: Joi.string().min(5).required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = { "isDeleted": 0, "isBlocked": 0, "isEmailVerified": 1,  "loginType":1 };
			if (payload.id) {
				criteria.id = payload.id;
			}
			let userData = await Services.UserService.getDetail(criteria, ["id", "name", "email", "password", "forgotPasswordOtp", "isEmailVerified", "forgotPasswordToken", "isBlocked", "createdAt"]);
            
			if (!userData) throw response.error_msg.emailAndPasswordNotFound;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			if (userData && userData.isEmailVerified === 0) throw response.error_msg.emailAndPasswordNotFound;
			let oldPassword = await commonHelper.encrypt(payload.oldPassword);
			let password = await commonHelper.encrypt(payload.newPassword);
			if (userData && userData.password !== oldPassword) throw response.error_msg.passwordNotMatch;
			let criteriaUpdate = {
				id : payload.id,
				isDeleted:0,
				isBlocked:0
			};
			let objSave = {
				password :password,
				forgotPasswordOtp :null,
				forgotPasswordToken :null,
				forgotPasswordGeneratedAt : new Date()
			};
			await Services.UserService.updateData(criteriaUpdate, objSave);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	logout: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				tokenId: Joi.string().required().allow(""),
				deviceToken: Joi.string().required().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let condition = {
				userId: payload.tokenId,
				deviceToken: payload.deviceToken,
			};
			await Services.SessionsService.deleteSessions(condition);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	uploadAuthenticityDocuments: async (payloadData) => {
		const schema = Joi.object().keys({
			userId: Joi.string().required(),
			serviceId: Joi.string().optional().allow(""),
			militaryJobTitle: Joi.string().optional().allow(""),
			authenticityDocumentLink: Joi.string().optional().allow(""),
			veteranRelationDocumentLink: Joi.string().optional().allow(""),
			veteranRelationName: Joi.string().optional().allow(""),
			serviceDisabled : Joi.number().optional(),
			userType: Joi.number().valid(0, 1).optional().allow(""),
			honorAwardArray : Joi.array().optional().items(Joi.object().keys({
				name: Joi.string().required(),
				orderByIndex: Joi.number().required()
			})),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToUpdate = {};
		let criteria = {
			id: payload.userId
		};
		if (_.has(payloadData, "serviceId") && payloadData.serviceId != "") objToUpdate.serviceId = payload.serviceId;
		if (_.has(payloadData, "militaryJobTitle") && payloadData.militaryJobTitle != "") objToUpdate.militaryJobTitle = payload.militaryJobTitle;
		if (_.has(payloadData, "authenticityDocumentLink") && payloadData.authenticityDocumentLink != "") objToUpdate.authenticityDocumentLink = payload.authenticityDocumentLink;
		if (_.has(payloadData, "veteranRelationDocumentLink") && payloadData.veteranRelationDocumentLink != "") objToUpdate.veteranRelationDocumentLink = payload.veteranRelationDocumentLink;
		if (_.has(payloadData, "veteranRelationName") && payloadData.veteranRelationName != "") objToUpdate.veteranRelationName = payload.veteranRelationName;
		if (_.has(payloadData, "serviceDisabled") && payloadData.serviceDisabled != "") objToUpdate.serviceDisabled = payload.serviceDisabled;
		let honorAwardArray = payload.honorAwardArray;
		if (honorAwardArray && honorAwardArray.length > 0 && payload.userType === 1) {
			let arrSkills = honorAwardArray.map(value => ({...value, userId: payload.userId}));
			let criteriaArr={
				userId: payload.userId,
				isType : 0
			};
			await Services.UserBuildResumeService.deleteRecords(Models.UserAwardsAndHonors,criteriaArr);
			await Services.UserBuildResumeService.saveUserAwardsAndHonors(arrSkills);
		}
		await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isUploadDoucment : 1, isSteped:1});
		await Services.UserService.updateData(criteria, objToUpdate);
		return response.STATUS_MSG.SUCCESS.DEFAULT; 
	},
	uploadAuthenticityDocumentsV1: async (payloadData) => {
		const schema = Joi.object().keys({
			userId: Joi.string().required(),
			serviceId: Joi.string().optional().allow(""),
			otherServiceTitle: Joi.string().optional().allow(""),
			militaryJobTitle: Joi.string().optional().allow(""),
			authenticityDocumentLink: Joi.string().optional().allow(""),
			veteranRelationDocumentLink: Joi.string().optional().allow(""),
			veteranRelationName: Joi.string().optional().allow(""),
			serviceDisabled : Joi.number().optional(),
			userType: Joi.number().valid(0, 1).optional().allow(""),
			honorAwardArray : Joi.array().optional().items(Joi.object().keys({
				name: Joi.string().required(),
				orderByIndex: Joi.number().required()
			})),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToUpdate = {};
		let criteria = {
			id: payload.userId
		};
		if (_.has(payloadData, "serviceId") && payloadData.serviceId != "") objToUpdate.serviceId = payload.serviceId;
		if (_.has(payloadData, "militaryJobTitle") && payloadData.militaryJobTitle != "") objToUpdate.militaryJobTitle = payload.militaryJobTitle;
		if (_.has(payloadData, "authenticityDocumentLink") && payloadData.authenticityDocumentLink != "") objToUpdate.authenticityDocumentLink = payload.authenticityDocumentLink;
		if (_.has(payloadData, "veteranRelationDocumentLink") && payloadData.veteranRelationDocumentLink != "") objToUpdate.veteranRelationDocumentLink = payload.veteranRelationDocumentLink;
		if (_.has(payloadData, "veteranRelationName") && payloadData.veteranRelationName != "") objToUpdate.veteranRelationName = payload.veteranRelationName;
		if (_.has(payloadData, "serviceDisabled") && payloadData.serviceDisabled != "") objToUpdate.serviceDisabled = payload.serviceDisabled;
		if (_.has(payloadData, "otherServiceTitle") && payloadData.otherServiceTitle != "") objToUpdate.otherServiceTitle = payload.otherServiceTitle;
		let honorAwardArray = payload.honorAwardArray;
		if (honorAwardArray && honorAwardArray.length > 0 && payload.userType === 1) {
			let arrSkills = honorAwardArray.map(value => ({...value, userId: payload.userId}));
			let criteriaArr={
				userId: payload.userId,
				isType : 0
			};
			await Services.UserBuildResumeService.deleteRecords(Models.UserAwardsAndHonors,criteriaArr);
			await Services.UserBuildResumeService.saveUserAwardsAndHonors(arrSkills);
		}
		await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isUploadDoucment : 1});
		await lastUpdateStep(payload, {isUploadDoucment : 1, isSteped:1});
		await Services.UserService.updateData(criteria, objToUpdate);
		return response.STATUS_MSG.SUCCESS.DEFAULT; 
	},
	updateProfile: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				name: Joi.string().optional().allow(""),
				profileImage: Joi.string().optional().allow(""),
				pronounsType: Joi.string().optional().allow(""),
				customPronouns: Joi.string().optional().allow(""),
				bio: Joi.string().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				dateOfBirth: Joi.string().optional().allow(""),
				gender: Joi.number().optional(),
				serviceDisabled: Joi.number().optional(),
				linkedInLink: Joi.string().optional().allow(""),
				honorAwardArray : Joi.array().optional().items(Joi.object().keys({
					name: Joi.string().required(),
					orderByIndex: Joi.number().required()
				})),
				scoreLink: Joi.string().optional().allow(""),
				location: Joi.string().optional().allow(""),
				zipCode: Joi.string().optional().allow(""),
				latitude: Joi.string().optional().allow(""),
				longitude: Joi.string().optional().allow("")
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate = {};
			let criteria = {
				id: payload.userId
			};
			if (_.has(payloadData, "name") && payloadData.name != "") objToUpdate.name = payload.name;
			if (_.has(payloadData, "profileImage") && payloadData.profileImage != "") objToUpdate.profileImage = payload.profileImage;
			if (_.has(payloadData, "pronounsType") && payloadData.pronounsType != "") objToUpdate.pronounsType = payload.pronounsType;
			if (_.has(payloadData, "customPronouns") && payloadData.customPronouns != "") objToUpdate.customPronouns = payload.customPronouns;
			if (_.has(payloadData, "bio") && payloadData.bio != "") objToUpdate.bio = payload.bio;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToUpdate.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToUpdate.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "dateOfBirth") && payloadData.dateOfBirth != "") objToUpdate.dateOfBirth = payload.dateOfBirth;
			if (_.has(payloadData, "gender") && payloadData.gender != "") objToUpdate.gender = payload.gender;
			if (_.has(payloadData, "location") && payloadData.location != "") objToUpdate.location = payload.location;
			if (_.has(payloadData, "latitude") && payloadData.latitude != "") objToUpdate.latitude = payload.latitude;
			if (_.has(payloadData, "longitude") && payloadData.longitude != "") objToUpdate.longitude = payload.longitude;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			if (_.has(payloadData, "serviceDisabled") && payloadData.serviceDisabled != "") objToUpdate.serviceDisabled = payload.serviceDisabled;
			if (_.has(payloadData, "linkedInLink") && payloadData.linkedInLink != "") objToUpdate.linkedInLink = payload.linkedInLink;
			if (_.has(payloadData, "scoreLink") && payloadData.scoreLink != "") objToUpdate.scoreLink = payload.scoreLink;
			await Services.UserService.updateData(criteria, objToUpdate);
			let honorAwardArray = payload.honorAwardArray;
			if (honorAwardArray && honorAwardArray.length > 0) {
				let arrSkills = honorAwardArray.map(value => ({...value, userId: payload.userId}));
				let criteria={
					userId: payload.userId,
					isType : 0
				};
				await Services.UserBuildResumeService.deleteRecords(Models.UserAwardsAndHonors,criteria);
				await Services.UserBuildResumeService.saveUserAwardsAndHonors(arrSkills);
			}
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isCreateProfile : 1});
			await lastUpdateStep(payload, {isCreateProfile : 1, isSteped:2});
			return response.STATUS_MSG.SUCCESS.DEFAULT; 
		}catch (err) {
			console.log(err);
			throw err;
		}
		
	},
	uploadDocuments:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required().allow(""),
				resumeName: Joi.string().required().allow(""),
				resumeDocuments: Joi.string().required().allow(""),
				documentsType : Joi.number().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "resumeName") && payloadData.resumeName != "") objToSave.name = payload.resumeName;
			if (_.has(payloadData, "resumeDocuments") && payloadData.resumeDocuments != "") objToSave.fileName = payload.resumeDocuments;
			if (_.has(payloadData, "documentsType")) objToSave.documentTyped = payload.documentsType;
			objToSave.userId = payload.tokenId; 
			console.log(objToSave, "objToSave");
			await Services.UserDocumentsService.saveData(objToSave);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.tokenId}, {isUploadResume : 1});
			await lastUpdateStep({userId: payload.tokenId}, {isUploadResume : 1, isSteped:3});
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateUploadDocuments:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				tokenId: Joi.string().required().allow(""),
				resumeName: Joi.string().required().allow(""),
				resumeDocuments: Joi.string().required().allow(""),
				documentsType : Joi.number().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			let criteria={
				id: payload.id,
				userId: payload.tokenId
			};
			if (_.has(payloadData, "resumeName") && payloadData.resumeName != "") objToSave.name = payload.resumeName;
			if (_.has(payloadData, "resumeDocuments") && payloadData.resumeDocuments != "") objToSave.fileName = payload.resumeDocuments;
			if (_.has(payloadData, "documentsType")) objToSave.documentTyped = payload.documentsType;
			objToSave.userId = payload.tokenId; 
			await Services.UserDocumentsService.updateData(criteria, objToSave);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteUploadDocuments:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				tokenId: Joi.string().required().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {
				isDeleted : 1
			};
			let criteria={
				id: payload.id,
				userId: payload.tokenId
			};
			await Services.UserDocumentsService.updateData(criteria, objToSave);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	getAllUploadDocuments:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required().allow(""),
				documentsType : Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let objToSave = {};
			let criteria={
				userId: payload.tokenId,
				isDeleted : 0
			};
			if (_.has(payloadData, "documentsType")) criteria.documentTyped = payload.documentsType;
			let projection = ["id", "name", "fileName", "documentTyped", "isDeleted", "createdAt"];   
			console.log(criteria, "criteria");
			let uploadDocuments =await Services.UserDocumentsService.getList(criteria, projection, 10, 0);
			return {listing: uploadDocuments};
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	getUserDetails:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required().allow(""),
				ipAddress: Joi.string().required().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let objToSave = {};
			let criteria={
				id: payload.tokenId,
				isDeleted : 0
			};
			let projection = ["id", "name", "email", "bio","pronounsType", "customPronouns", "dateOfBirth", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified", "otherServiceTitle", "notificationStatus",
				"gender", "serviceDisabled","veteranRelationDocumentLink","scoreLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink","serviceId", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "lastVisit", "createdAt",
				[Sequelize.literal("(SELECT (services.name) FROM services as services where users.serviceId = services.id)"), "Services"]
			];
			let userData = await Services.UserService.getDetail(criteria, projection, true);
			let userResumeStatus = await Services.UserBuildResumeService.getByIdResumeStatus({ userId: payload.tokenId });
			let getAwardsAndHonors = await Services.UserBuildResumeService.getAwardsAndHonors({ userId: payload.tokenId, isType: 0 });
			await Services.UserService.updateData(criteria, {lastVisit: new Date()});
			userData.dataValues.s3Folders = env.AWS.S3;
			userData.dataValues.userResumeStatus = userResumeStatus;
			userData.dataValues.userAwardsAndHonors = getAwardsAndHonors;
			userData.dataValues.unreadCount = await Services.UserNotificationService.unreadCount({ userId: payload.tokenId });
			userData.dataValues.ipAddress = payload.ipAddress;
			return userData;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	notificationSetting:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required(),
				notificationStatus:Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let objToSave = {};
			let criteria={
				id: payload.tokenId,
				isDeleted : 0
			};
			let update =await Services.UserService.updateData(criteria, {notificationStatus: payload.notificationStatus});
			return {status : payload.notificationStatus};
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	getUserResumeStatus:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let objToSave = {};
			let criteria={
				id: payload.tokenId,
				isDeleted : 0
			};
			console.log(criteria);
			let userResumeStatus = await Services.UserBuildResumeService.getByIdResumeStatus({ userId: payload.tokenId });
			return userResumeStatus;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	uploadDocumentsParsing: async (payloadData) => {
		try {
			console.log(payloadData);
			let filePath = "D:/Honorvet-backend/public/stylesheets/";
			let filename = "tf00002110_wac.docx";
			let resume = filePath+filename;
			console.log(resume, "resume");
			let FILE_DATA= await base64_encode(resume);
			// console.log(FILE_DATA, "FILE_DATA");
			var jsonObject = JSON.stringify({
				"filedata":FILE_DATA,
				"filename":filename,
				"userkey":"AAZ415JC",
				"version":"8.0.0",
				"subuserid":"Rajeev Sharma"
			});
			var postheaders = {
				"Content-Type" : "application/json",
				"Content-Length" : Buffer.byteLength(jsonObject, "utf8")
			};
			var optionspost = {
				host : "rest.rchilli.com",
				port : 443,
				path : "/RChilliParser/Rchilli/parseResumeBinary",
				method : "POST",
				headers : postheaders
			};
			let dataResume = await parseResume(optionspost, jsonObject);
			// console.log(dataResume, "dataResume");
			console.log(typeof dataResume, "dataResume>>>>>>>>>>>");

			// console.log(payloadData, "payloadData");
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteUserAccount:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required(),
				password: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.tokenId,
				isDeleted : 0
			};
			let condition = {
				userId: payload.tokenId,
			};
			let projectionUser = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "password", "isEmailVerified", "isPhoneVerified", "otp",
				"gender", "serviceDisabled","veteranRelationDocumentLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
			];
			let findUser={
				id:payload.tokenId
			};
			let loginTypeCheck=await Services.UserService.getDetail(findUser, projectionUser);
			if (loginTypeCheck && loginTypeCheck.isEmailVerified === 0) throw response.error_msg.emailAndPasswordNotFound;
			if(loginTypeCheck && loginTypeCheck.loginType === 1 && payload.password){
				let password = await commonHelper.encrypt(payload.password);
				if (loginTypeCheck && loginTypeCheck.password !== password) throw response.error_msg.passwordNotMatch;
				await Services.UserService.deleteUserDelete(criteria);
				await Services.SessionsService.deleteSessions(condition);
			}else{
				await Services.UserService.deleteUserDelete(criteria);
				await Services.SessionsService.deleteSessions(condition);
			}
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	userMobileVerify:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required(),
				countryCode: Joi.string().required(),
				mobileNo: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let otp = await commonHelper.generateRandomNumbers(4);
			// let otp = 1111;
			let criteria = {
				id: payload.tokenId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let projection = ["id", "name", "email", "isEmailVerified", "countryCode", "phoneNumber"];
			let userData = await Services.UserService.getDetail(criteria, projection);

			if (!userData) throw Response.error_msg.InvalidID;
			let objToSave = {};
			objToSave.countryCode = payload.countryCode;
			objToSave.phoneNumber = payload.mobileNo;
			objToSave.isPhoneVerified = 0;
			objToSave.otpGeneratedAt = moment().toString();
			objToSave.otp = otp;
			let twilioData = {
				otp: `${otp} is the OTP to verify your phone number on the HonorVet app. OTP is valid for 3 minutes.`,
				phoneNumber: payload.countryCode + payload.mobileNo,
			};
			await NotificationManager.sendSms(twilioData);
			await Services.UserService.updateData(criteria, objToSave);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	userMobileVerifyOtp:async (payloadData) => {
		try{
			const schema = Joi.object().keys({
				tokenId: Joi.string().required(),
				otp: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"id": payload.tokenId,
				"otp":payload.otp,
				"isDeleted": "0",
				"isBlocked": "0"
			};
			let projectionUser = ["id", "name", "email", "bio", "countryCode", "otpGeneratedAt", "phoneNumber", "isEmailVerified", "isPhoneVerified", "otp",
				"gender", "serviceDisabled", "veteranRelationDocumentLink","veteranRelationName","veteranRelationType","personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
			];            
			let userData = await Services.UserService.getDetail(criteria, projectionUser);
			if (!userData) throw response.error_msg.invalidOtp;

			if (userData.otpGeneratedAt && userData.otpGeneratedAt != null) {
				let diffInMinutes = moment.utc(moment(new Date(), "HH:mm:ss").diff(moment(userData.otpGeneratedAt, "HH:mm:ss"))).format("m");
				if (diffInMinutes && diffInMinutes >= 3) {
					let objToUpdate = { otpGeneratedAt: null, otp: null};
					await Services.UserService.updateData({ id: userData.id }, objToUpdate);
					throw response.error_msg.otpExpired;
				}
			}
			await Services.UserService.updateData(criteria, { otp: null, isPhoneVerified: 1, });
			return response.STATUS_MSG.SUCCESS.DEFAULT;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
};

let  base64_encode = async(documentFile) => {
	try{
		var documentFileBinaryData = fs.readFileSync(documentFile);
		return new Buffer(documentFileBinaryData).toString("base64");
	}catch (err) {
		console.log(err);
		throw err;
	}
};
// console.log(parseResume_old);
let parseResume_old = async (optionspost) => {
	try {
		console.log(optionspost, "optionspost");
		return new Promise((resolve, reject) => {
			let request = https.request(optionspost, (response) => {
				const body = [];
				response.on("data", (chunk) => body.push(chunk));
				response.on("end", () => resolve(body));
			});
			request.on("error", (err) => reject(err));

		});
	} catch (err){
		console.log(err);
		throw err;
	}
};

let parseResume = async (optionspost, jsonObject) => {
	try {
		console.log(optionspost, "optionspost");
		return new Promise((resolve, reject) => {
			var reqPost = https.request(optionspost, function(res) {
				// console.log("statusCode: ", res.statusCode);
				var chunks = [];
				res.on("data", function (chunk) {
					chunks.push(chunk);
				});
				res.on("end", function (chunk) {
					var body = Buffer.concat(chunks);
					body    =   JSON.parse(body);
					console.log(chunk, "chunk");
					resolve(body);
					// console.log(body.toString());
				});

				res.on("error", function (error) {
					console.error(error);
					reject(error);
				});
			});
			// write the json data
			reqPost.write(jsonObject);
			reqPost.end();
			reqPost.on("error", function(e) {
				reject(e);
			});

		});
	} catch (err){
		console.log(err);
		throw err;
	}
};
let lastUpdateStep = async(payload, isStepedObj) =>{
	try {
		let checkResumeStatus1= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
		if (checkResumeStatus1.isSteped <= isStepedObj.isSteped) {
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, isStepedObj);
		}
	}catch (err) {
		console.log(err);
		throw err;
	}
};
