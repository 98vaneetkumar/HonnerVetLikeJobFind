const _ = require("underscore");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const response = require("../../config/response");
const Services = require("../../services");
const TokenManager = require("../../helpers/recruiterTokenManager");
const env = require("../../config/env")();
const Mailer = require("../../helpers/mailer");
const Sequelize = require("sequelize");

const Models = require("../../models");
const PRIVATE_KEY = env.APP_URLS.PRIVATE_KEY_COACH;
var projection = ["id","userType", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified","isArchive", "subscribePayment", "inventoryPayment", "isNotificationSMSSetting", "isNotificationSetting",
	"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","address","state","city","subscribeHonorvet",
	"companyEmail", "isAdminApproved", "reason"
];

let  Projection1 = ["id","recruiterId","firstName","lastName","phoneNumber","companyName","state","city","countryCode","address","recruiterId","countryName","zipCode"];
let  Projection2 = ["id", "createJob", "viewTeamMemberJob", "editTeamMemberJob", "addTeamMember", "editTeamMember", "deleteTeamMember", "viewActivePlans", "buyInventory", "viewInvoice", "cancelSubscription", "dashboard", "jobPost", "search", "user", "groupAndPermission", "messages", "reports", "myCandidate" ];
var generateToken = async (recruiterId, email, userType, platform, sessionData) => {
	try {
		let tokenData = {
			email: email,
			id: recruiterId,
			userType: userType,
			platform: platform
		};
		let userData = await Services.RecruiterService.getDetail({ id: recruiterId }, projection, true);
		let token = await Jwt.sign(tokenData, PRIVATE_KEY);
		let groupPermission = await Services.BaseService.getSingleRecord(Models.Permission, {recruiterId:userData.id}, Projection2);
		await TokenManager.setTokenInDB(recruiterId, sessionData, token);

		let response = userData.dataValues;
		response.accessToken = token;
		response.s3Folders = env.AWS.S3;
		response.groupPermission = groupPermission;
		return response;

	} catch (err) {
		console.log(err);
		throw err;
	}
};

var emailVerification = async (recruiterId) => {
	try {
		let generatedString = await commonHelper.generateRandomNumbers(4);
		let otp = await commonHelper.generateRandomNumbers(4);
		// let otp = 1111;
		let criteria = {
			id: recruiterId,
			isBlocked:"0",
			isDeleted:"0"
		};
		let projection = ["id", "name", "email", "isEmailVerified", "countryCode", "phoneNumber"];
		let userData = await Services.RecruiterService.getDetail(criteria, projection);

		if (!userData) throw Response.error_msg.InvalidID;
		let objToSave = {};
		objToSave.emailVerificationToken = generatedString;
		objToSave.otp = otp;
		await Services.RecruiterService.updateData(criteria, objToSave);
		let path = "/api/v1/user/verifyEmail?token=";
		let logoImage = "logo.png";
		var variableDetails = {
			name: userData.name,
			verificationUrl: env.APP_URLS.API_URL + path + generatedString,
			otp: otp,
			s3logo: env.AWS.S3.s3Url+logoImage,
			ip: env.APP_URLS.API_URL,
			termsUrl: env.APP_URLS.API_URL + "/api/v1/user/terms",
			privacyUrl: env.APP_URLS.API_URL + "/api/v1/user/privacy-policy"
		};
		await Mailer.sendMail("REGISTER_RECRUITER", userData.email, variableDetails);
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
			email: Joi.string().email().optional().allow(""),
			deviceToken: Joi.string().required().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objSave = {};
		let projection = ["id", "email", "isBlocked", "isEmailVerified"];
		let criteria = {};
		if (!payload.email) throw response.error_msg.EMPTY_VALUE;
		criteria.email = payload.email;
		criteria.isEmailVerified =1;
		criteria.isDeleted =0;
		if (_.has(payloadData, "name") && payloadData.name != "") objSave.name = payload.name;
		if (_.has(payloadData, "email") && payloadData.email != "") objSave.email = payload.email;
		if (_.has(payloadData, "deviceToken") && payloadData.deviceToken != "") objSave.deviceToken = payload.deviceToken;
		if (_.has(payloadData, "platformType") && payloadData.platformType != "") objSave.platformType = payload.platformType;
		objSave.userType="SUPER_RECRUITER";
		let userData = await Services.RecruiterService.getDetail(criteria, projection);
		if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
		if (userData && userData.id) {
			throw response.error_msg.alreadyExist;
		}
		let createUser;
		if (!userData) {
			if (payload.email) {
				let criteriaDelete = {
					"isDeleted": "0",
					"isEmailVerified": "0",
					"email": payload.email
				};
				await Services.RecruiterService.deleteUserDelete(criteriaDelete);
			}
			createUser = await Services.RecruiterService.saveData(objSave);
			await emailVerification(createUser.id);
		}else{
			let userCriteria = {
				id: userData.id,
			};
			createUser = await Services.RecruiterService.getDetail(userCriteria, ["id"]);
		}
		let sessionData = {
			id: createUser.id,
			deviceToken: payload.deviceToken,
			deviceType: "WEB"
		};
		return await generateToken(createUser.id, payload.email, 1, "WEB", sessionData);

	},
	verifyOtp: async(payloadData) =>{
		const schema = Joi.object().keys({
			otp: Joi.string().required().allow(""),               
			tokenId: Joi.string().required(),               
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			"id": payload.tokenId,
			"otp":payload.otp,
			"isDeleted": "0",
			"isBlocked": "0"
		};
	
		let userData = await Services.RecruiterService.getDetail(criteria, projection);
		if (!userData) throw response.error_msg.invalidOtp;
		await Services.RecruiterService.updateData(criteria, { otp: null, isEmailVerified: "1", });
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
			let password = await commonHelper.generateNewPassword(payload.password);
			objSave.password = password;
		}
		let criteria = {
			"id": payload.tokenId,
			"isEmailVerified": "1",
			"isDeleted": "0",
			"isBlocked": "0"
		};
		
		let userData = await Services.RecruiterService.getDetail(criteria, projection);
		if (!userData) throw response.error_msg.InvalidID;
		await Services.RecruiterService.updateData(criteria, objSave);
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
				deviceToken: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"email": payload.email,
				"isDeleted": "0",
				"isEmailVerified": "1"
			};
			let projections = [...projection];
			projections.push("password");

			let userData = await Services.RecruiterService.getDetail(criteria, projections);
			if (!userData) throw response.error_msg.emailAndPasswordNotFound;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			if (userData && userData.isEmailVerified === 0) throw response.error_msg.emailAndPasswordNotFound;
			// if (userData && userData.isArchive === 1) throw response.error_msg.blockUser;
			let comparePass = await commonHelper.comparePassword(payload.password,userData.password);
			if (!comparePass) throw response.error_msg.passwordNotMatch;
			let sessionData = {
				id: userData.id,
				deviceToken: payload.deviceToken,
				deviceType: "WEB"
			};
			return await generateToken(userData.id, payload.email, 0, "WEB", sessionData);
		}catch (err) {
			console.log("err", err);
			throw err;
		}
	},
	forgotPassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().required().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = { "isDeleted": 0, "isBlocked": 0, "isEmailVerified": 1 };
			if (payload.email) {
				criteria.email = payload.email;
			}
			let userData = await Services.RecruiterService.getDetail(criteria, ["id", "name", "email"]);
			if (!userData) throw response.error_msg.emailNotFound;
			// if (!userData) throw response.error_msg.emailNotVerified;
			let generatedString = await commonHelper.generateRandomNumbers(6);
			let newToken = await commonHelper.encrypt(generatedString);
			let otp = await commonHelper.generateRandomNumbers(4);
			if (payload.email) {
				let path = "/recruiter/v1/recruiter/generatePassword?email=" + userData.email + "&token=";
				let logoImage = "logo.png";
				var variableDetails = {
					name: userData.name,
					otp: otp,
					ip: env.APP_URLS.API_URL, 
					s3logo: env.AWS.S3.s3Url+logoImage,
					resetPasswordToken: env.APP_URLS.API_URL + path + generatedString,
					termsUrl: env.APP_URLS.API_URL + "/api/v1/user/terms",
					privacyUrl: env.APP_URLS.API_URL + "/api/v1/user/privacy-policy"
				};
				await Mailer.sendMail("FORGOT_PASSWORD_RECRUITER", userData.email, variableDetails);
				await Services.RecruiterService.updateData(criteria, { forgotPasswordOtp: otp,  forgotPasswordToken: newToken });
				return response.STATUS_MSG.SUCCESS.DEFAULT;
			}else{
				return false;
			} 
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	resetNewPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			token: Joi.string().optional().required(),
			newPassword: Joi.string().min(5).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let encryptedToken = await commonHelper.encrypt(payload.token);
		let recruiterObj = null;
		let criteria = {
			isDeleted: 0,
			forgotPasswordToken: encryptedToken
		};
		let recruiter = await Services.RecruiterService.getDetail(criteria, ["id", "email", "password"], false);
		if (recruiter) {
			recruiterObj = recruiter.dataValues;
			if (recruiterObj && recruiterObj.id) {
				let criteria = {
					id: recruiterObj.id
				};
				let objToSave = {
					password: await commonHelper.generateNewPassword(payload.newPassword),
					forgotPasswordGeneratedAt: null,
					forgotPasswordToken: null
				};
				let update = await Services.RecruiterService.updateData(criteria, objToSave);
				if (update) {
					return message.success.UPDATED;
				} else throw response.error_msg.implementationError;
			} else {
				throw response.error_msg.implementationError;
			}
		} else {
			throw response.error_msg.InvalidPasswordToken;
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
			let userData = await Services.RecruiterService.getDetail({ isDeleted: 0, forgotPasswordToken: encryptedToken, email:payload.email }, ["id", "email"]);
			if (!userData) throw response.error_msg.InvalidPasswordToken;
			let criteria = {
				id: userData.id,
			};
			let password=await commonHelper.generateNewPassword(payload.newPassword);
			// let password = await commonHelper.encrypt(payload.newPassword);
			await Services.RecruiterService.updateData(criteria, {
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
			let userData = await Services.RecruiterService.getDetail(criteria, ["id", "name", "email"]);
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
			let criteria = { "isDeleted": 0, "isBlocked": 0, "isEmailVerified": 1};
			if (payload.id) {
				criteria.id = payload.id;
			}
			let userData = await Services.RecruiterService.getDetail(criteria, ["id", "name", "email", "password",  "isEmailVerified",  "isBlocked", "createdAt"]);
            
			if (!userData) throw response.error_msg.emailAndPasswordNotFound;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			if (userData && userData.isEmailVerified === 0) throw response.error_msg.emailAndPasswordNotFound;
			let password=await commonHelper.generateNewPassword(payload.newPassword);
			let comparePass=await commonHelper.comparePassword(payload.oldPassword,userData.password);
			if (!comparePass) throw response.error_msg.passwordNotMatch;
			let criteriaUpdate = {
				id : userData.id,
				isDeleted:0,
				isBlocked:0
			};
			let objSave = {
				password :password,
	
			};
			await Services.RecruiterService.updateData(criteriaUpdate, objSave);
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
	updateProfile: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				profileImage: Joi.string().optional().allow(""),
				name: Joi.string().optional().allow(""),
				description: Joi.string().optional().allow(""),
				companyEmail: Joi.string().optional().allow(""),
				companySize: Joi.string().optional().allow(""),
				websiteLink: Joi.string().optional().allow(""),
				linkedInLink: Joi.string().optional().allow(""),
				industry: Joi.string().optional().allow(""),
				companyName: Joi.string().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				dateOfBirth: Joi.string().optional().allow(""),
				address: Joi.string().optional().allow(""),
				state: Joi.string().optional().allow(""),
				city: Joi.string().optional().allow(""),
				gender: Joi.number().optional(),
				location: Joi.string().optional().allow(""),
				zipCode: Joi.string().optional().allow(""),
				latitude: Joi.string().optional().allow(""),
				longitude: Joi.string().optional().allow(""),
				subscribeHonorvet: Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate = {};
			let criteria = {
				id: payload.id
			};
			if (_.has(payloadData, "profileImage") && payloadData.profileImage != "") objToUpdate.profileImage = payload.profileImage;
			if (_.has(payloadData, "name") && payloadData.name != "") objToUpdate.name = payload.name;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "companySize") && payloadData.companySize != "") objToUpdate.companySize = payload.companySize;
			if (_.has(payloadData, "companyEmail") && payloadData.companyEmail != "") objToUpdate.companyEmail = payload.companyEmail;
			if (_.has(payloadData, "websiteLink") && payloadData.websiteLink != "") objToUpdate.websiteLink = payload.websiteLink;
			if (_.has(payloadData, "linkedInLink") && payloadData.linkedInLink != "") objToUpdate.linkedInLink = payload.linkedInLink;
			if (_.has(payloadData, "industry") && payloadData.industry != "") objToUpdate.industry = payload.industry;
			if (_.has(payloadData, "companyName") && payloadData.companyName != "") objToUpdate.companyName = payload.companyName;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToUpdate.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToUpdate.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "dateOfBirth") && payloadData.dateOfBirth != "") objToUpdate.dateOfBirth = payload.dateOfBirth;
			if (_.has(payloadData, "gender") && payloadData.gender != "") objToUpdate.gender = payload.gender;
			if (_.has(payloadData, "location") && payloadData.location != "") objToUpdate.location = payload.location;
			if (_.has(payloadData, "latitude") && payloadData.latitude != "") objToUpdate.latitude = payload.latitude;
			if (_.has(payloadData, "longitude") && payloadData.longitude != "") objToUpdate.longitude = payload.longitude;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			if (_.has(payloadData, "address") && payloadData.address != "") objToUpdate.address = payload.address;
			if (_.has(payloadData, "state") && payloadData.state != "") objToUpdate.state = payload.state;
			if (_.has(payloadData, "city") && payloadData.city != "") objToUpdate.city = payload.city;
			if (_.has(payloadData, "subscribeHonorvet")) objToUpdate.subscribeHonorvet = payload.subscribeHonorvet;
			await Services.RecruiterService.updateData(criteria, objToUpdate);
			return response.STATUS_MSG.SUCCESS.DEFAULT; 
		}catch (err){
			console.log(err);
			throw err;
		}
	
	},
	getAllRecruiter: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				limit: Joi.number().required(),
				skip: Joi.number().required(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
				isBlocked: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let admins = await Services.RecruiterService.getAllRecruiter(payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			if (admins) {
				return admins;
			} else {
				return {
					rows: [],
					count: 0,
				};
			}
			
		} catch (err){
			console.log(err);
			throw err;
		}	
	},
	getRecruiterById: async(paramData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(paramData, schema);
			let criteria = {
				id: payload.id,
			};
			let projectionDetail = [...projection];
			projectionDetail.push([Sequelize.literal("(SELECT job_posts.noOfPeopleRequired FROM job_posts as job_posts where job_posts.recuiterId = recruiter.id limit 1)"), "Number_Of_People_Required"],
				[Sequelize.literal("(SELECT  COUNT(job_posts.id) FROM job_posts as job_posts where job_posts.recuiterId = recruiter.id)"), "Number_Of_Jobs_Posted"]);
			let Recuiter = await Services.RecruiterService.getRecruiterById(criteria, projectionDetail);
			let JobsApplied =await Services.UserJobService.count(criteria);
			return {
				Recruiter: Recuiter,
				JobsApplied: JobsApplied,
			};
			
		} catch (err){
			console.log(err);
			throw err;
		}	
		
	},

	getRecruiterPermissionById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			id: payload.id,
		};
		var projection = ["id","userType", "name", "email", "companyName", "description"];
		let usersPermission = Services.RecruiterService.getDetail(criteria,projection, true);
		if (usersPermission) {
			return usersPermission;
		} else {
			throw Response.error_msg.recordNotFound;
		}
	},
	//Billing Address API

	updatebillingAddress: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				firstName: Joi.string().optional().allow(""),
				lastName: Joi.string().optional().allow(""),
				companyName: Joi.string().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				address: Joi.string().optional().allow(""),
				state: Joi.string().optional().allow(""),
				city: Joi.string().optional().allow(""),
				recruiterId: Joi.string().optional(),
				countryName: Joi.string().optional().allow(""),
				zipCode: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate = {};

			let criteria = {
				recruiterId: payload.id
			};
			if (_.has(payloadData, "firstName") && payloadData.firstName != "") objToUpdate.firstName = payload.firstName;
			if (_.has(payloadData, "lastName") && payloadData.lastName != "") objToUpdate.lastName = payload.lastName;
			if (_.has(payloadData, "companyName") && payloadData.companyName != "") objToUpdate.companyName = payload.companyName;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToUpdate.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToUpdate.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "address") && payloadData.address != "") objToUpdate.address = payload.address;
			if (_.has(payloadData, "state") && payloadData.state != "") objToUpdate.state = payload.state;
			if (_.has(payloadData, "city") && payloadData.city != "") objToUpdate.city = payload.city;
			if (_.has(payloadData, "countryName") && payloadData.countryName != "") objToUpdate.countryName = payload.countryName;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			objToUpdate.recruiterId=payloadData.id;

			let billingAddress = await Services.RecruiterService.getAllBillingAddress(criteria, Projection1);
			if(billingAddress == null ) {
				await Services.BaseService.saveData(Models.BillingAddress,objToUpdate);
				return response.STATUS_MSG.SUCCESS.DEFAULT;
			} else if (billingAddress.dataValues.recruiterId) {
				await Services.BaseService.updateData(Models.BillingAddress,criteria, objToUpdate);
				return response.STATUS_MSG.SUCCESS.DEFAULT;
			}
		}catch (err){
			console.log(err);
			throw err;
		}
	
	},
	getbillingAddress: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				recruiterId: payload.id,
			};
			let billingAddress = await Services.RecruiterService.getAllBillingAddress(criteria, Projection1);
			return billingAddress;
		} catch (err){
			console.log(err);
			throw err;
		}	
	},

	//state country listing api

	getAllUsState: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
				isBlocked: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id","name"];
			let state = await Services.BaseService.getAllRecords(Models.UsState,payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			if (state) {
				return state;
			} else {
				return {
					rows: [],
					count: 0,
				};
			}
			
		} catch (err){
			console.log(err);
			throw err;
		}	
	},
	resetRecurringPayment: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				tokenId: Joi.string().optional(),
				subscribePayment: Joi.number().optional(),
				inventoryPayment: Joi.number().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"id": payload.tokenId,
				"isDeleted": "0",
				"isBlocked": "0"
			};
			let objSave = {};
			if (_.has(payloadData, "subscribePayment")) objSave.subscribePayment = payload.subscribePayment;
			if (_.has(payloadData, "inventoryPayment")) objSave.inventoryPayment = payload.inventoryPayment;
			let userData = await Services.RecruiterService.getDetail(criteria, projection);
			if (!userData) throw response.error_msg.InvalidID;
			await Services.RecruiterService.updateData(criteria, objSave);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
			
		} catch (err){
			console.log(err);
			throw err;
		}	
	},
	resetRecurringNotification: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				tokenId: Joi.string().optional(),
				isNotificationSetting: Joi.number().optional(),
				isNotificationSMSSetting: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"id": payload.tokenId,
				"isDeleted": "0",
				"isBlocked": "0"
			};
			let objSave = {};
			if (_.has(payloadData, "isNotificationSetting")) objSave.isNotificationSetting = payload.isNotificationSetting;
			if (_.has(payloadData, "isNotificationSMSSetting")) objSave.isNotificationSMSSetting = payload.isNotificationSMSSetting;
			let userData = await Services.RecruiterService.getDetail(criteria, projection);
			if (!userData) throw response.error_msg.InvalidID;
			await Services.RecruiterService.updateData(criteria, objSave);
			return response.STATUS_MSG.SUCCESS.DEFAULT;
			
		} catch (err){
			console.log(err);
			throw err;
		}	
	},
	getListTransaction: async(payloadData) => {
		const schema = Joi.object().keys({
			recruiterId: Joi.string().optional(),
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			startDate: Joi.date().optional(),
			endDate: Joi.date().optional(),
			planType: Joi.number().optional(),
		});
		// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
		// const fromDate = moment().subtract(7, "day").format("YYYY-MM-DD");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		let projection=["id","isBlocked","createdAt","recruiterId","planId","planName","numberOfJob","numberOfView","concurrentJobsAssignedEachPlan",
			"nonConcurrentJobsAssignedEachPlan","validity","duration","numberOfClicks","stripSubscriptionId","stripSubscriptionData","validityType","description",
			"planType","status","discount", "isSubscription", "planType",
			[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter.id =recruiter_transaction.recruiterId)"), "recruiterName"],
			[Sequelize.literal("(SELECT (planAmount- (planAmount*discount/100)))"), "planAmount"],
			[Sequelize.literal("(SELECT (createdAt + INTERVAL validity MONTH))"), "endDate"],
			[Sequelize.literal("(SELECT 1)"), "remaining"]
		]; 		
		result.count = await Services.RecruiterPaymentService.countTransaction(payload);
		result.listing = await Services.RecruiterPaymentService.getListingTransaction(
			payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);	
		return result;
	},
	getActivePlanlist: async(payloadData) => {
		const schema = Joi.object().keys({
			recruiterId: Joi.string().optional()
		});
		// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
		// const fromDate = moment().subtract(7, "day").format("YYYY-MM-DD");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		payload.isSubscription =1;
		let result= {};
		let projection=["id","isBlocked","createdAt","recruiterId","planId","planName","numberOfJob","numberOfView","concurrentJobsAssignedEachPlan",
			"nonConcurrentJobsAssignedEachPlan","validity","duration","numberOfClicks","stripSubscriptionId","stripSubscriptionData","validityType","description",
			"planType","status","discount", "isSubscription", "planType",
			[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter.id =recruiter_transaction.recruiterId)"), "recruiterName"],
			[Sequelize.literal("(SELECT (planAmount- (planAmount*discount/100)))"), "planAmount"],
			[Sequelize.literal("(SELECT (createdAt + INTERVAL validity MONTH))"), "endDate"],
			[Sequelize.literal("(SELECT 1)"), "remaining"]
		]; 		
		result.count = await Services.RecruiterPaymentService.countTransaction(payload);
		result.listing = await Services.RecruiterPaymentService.getListingTransaction(
			payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);	
		return result;
	},
};