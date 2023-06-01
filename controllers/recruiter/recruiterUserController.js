const _ = require("underscore");
const Joi = require("joi");
const Response = require("../../config/response");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const Services = require("../../services");
const Model = require("../../models");
const Mailer = require("../../helpers/mailer");
const Sequelize = require("sequelize");
const env = require("../../config/env")();
const Projection = ["id", "fullName", "email","phoneNumber","title","linkedin","recruiterId","createdAt","isBlocked","isArchive","lastActivity",
	[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter_users.recruiterId=recruiter.id)"), "recruiter"],
	[Sequelize.literal("(SELECT COUNT(DISTINCT job_posts.id) FROM job_posts as job_posts where job_posts.recuiterId = recruiter_users.recruiterId)"), "recruiterJobs"],
	[Sequelize.literal("(SELECT CONCAT('EM', RIGHT(recruiter_users.id, 7)) AS new_id ORDER BY new_id ASC)"),"newId"],
];
module.exports = {
	getAllRecruiterUsers: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().optional(),
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isArchive: Joi.number().valid(0,1).optional()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result = {};
		result.count= 	await Services.RecruiterUserService.count(payload);
		result.users = await Services.RecruiterUserService.getAllRecruiterUsers(payload, Projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		return result;
	},
	getAllRecruiterManageUsers: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().optional(),
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isArchive: Joi.number().valid(0,1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		// let criteria ={
		// 	id: payload.id
		// };

		let result = {};
		let ProjectionOne = ["id", "fullName", "email","phoneNumber","title","linkedin","recruiterId","createdAt","isBlocked","isArchive","lastActivity",
			[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter_users.recruiterId=recruiter.id)"), "recruiter"],
			[Sequelize.literal("(SELECT COUNT(DISTINCT job_posts.id) FROM job_posts as job_posts where job_posts.recuiterId = recruiter_users.recruiterId)"), "recruiterJobs"],
			[Sequelize.literal(`
		(CASE WHEN (SELECT (assign_user_group.select) FROM assign_user_group WHERE recruiter_users.id = assign_user_group.recruiterUserId AND groupPermissionId = '${payload.id}' LIMIT 1) IS  NULL THEN 1 ELSE (SELECT (assign_user_group.select) FROM assign_user_group WHERE recruiter_users.id = assign_user_group.recruiterUserId AND groupPermissionId = '${payload.id}' LIMIT 1) END)`),"select"]
		];
		result.count= 	await Services.RecruiterUserService.count(payload);
		result.users = await Services.RecruiterUserService.getAllRecruiterUsers(payload, ProjectionOne, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		return result;
	},
	getRecruiterUsersById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			id: payload.id,
		};
		let usersPermission = Services.RecruiterUserService.getRecruiterUsers(criteria, Projection, true);
		if (usersPermission) {
			return usersPermission;
		} else {
			throw Response.error_msg.recordNotFound;
		}
	},
	addRecruiterUsers: async(payloadData) => {
		const schema = Joi.object().keys({
			fullName: Joi.string().optional(),
			email: Joi.string().optional(),
			phoneNumber: Joi.string().optional(),
			title: Joi.string().optional(),
			linkedin: Joi.string().optional(),
			assignGroupIds: Joi.array().items(Joi.object()).optional(),
			recruiterId: Joi.string().optional(),
			userType: Joi.string().optional(),
			groupPermissions: Joi.array().items({
				module: Joi.string().required(),
				permission: Joi.number().valid(0, 1).required(),
			}),
		});

		// let generatedString = commonHelper.generateRandomString(6, "numeric");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			email: payload.email,
			isDeleted: 0
		};
		if (!payload.email) throw Response.error_msg.EMPTY_VALUE;

		let objToSave = {};
		if (_.has(payload, "fullName") && payload.fullName != "") objToSave.fullName = payload.fullName;
		if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
		if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
		if (_.has(payload, "title") && payload.title != "") objToSave.title = payload.title;
		if (_.has(payload, "linkedin") && payload.linkedin != "") objToSave.linkedin = payload.linkedin;
		objToSave.recruiterId=payloadData.recruiterId;

		let recruiterUsers = await Services.RecruiterUserService.getRecruiterUsers(criteria);
		let recruiter = await Services.RecruiterService.getRecruiterById(criteria);
		if (recruiterUsers && recruiterUsers.isBlocked === 1) throw Response.error_msg.blockUser;
		if (recruiterUsers && recruiterUsers.email ) throw Response.error_msg.alreadyExist;
		if (recruiter && recruiter.isBlocked === 1) throw Response.error_msg.blockUser;
		if (recruiter && recruiter.email) throw Response.error_msg.alreadyExist;
		
		let addRecruiterUsers = await Services.RecruiterUserService.addRecruiterUsers(objToSave);
		let permissions = {};
		let result ={};

		let saveData ={
			userType: "SUB_RECRUITER",
			email:  payloadData.email,
			isEmailVerified: "1",
			recruiterId: payloadData.recruiterId,
			isAdminApproved:"1",
			isArchive: "0"	
		};
		
		if (addRecruiterUsers) {
			if(payload.assignGroupIds&&payload.assignGroupIds.length>0){
				let assignGroup=payload.assignGroupIds.map(value => ({...value, recruiterUserId:addRecruiterUsers.id}));
				result.adddAssignGroup = await Services.JobPostService.saveBulkCreate(Model.AssignUserGroup,assignGroup);
			}
			if (payload.groupPermissions) {
				payload.groupPermissions.forEach((groupPermissions) => {
					permissions[groupPermissions.module] = groupPermissions.permission;
				});
			}
			
			let recruiterUsersSave = await Services.RecruiterService.saveData(saveData);
			
			permissions.recruiterId = recruiterUsersSave.id;
			permissions.recruiterUserId = addRecruiterUsers.dataValues.id;
			await Services.BaseService.saveData(Model.Permission,permissions);
			console.log("paylodaData",payloadData);
			let saveData ={
				userType: "SUB_RECRUITER",
				email:  payloadData.email,
				isEmailVerified: "1",
				recruiterId: payloadData.recruiterId,
				isAdminApproved:"1",
				isArchive: "0"
			};
			// let recruiterUsers = await Services.RecruiterService.saveData(saveData);
			let generatedString = await commonHelper.generateRandomNumbers(6);
			let newToken = await commonHelper.encrypt(generatedString);
			let otp = await commonHelper.generateRandomNumbers(4);
			let path = "/recruiter/v1/recruiter/generatePassword?email=" + recruiterUsersSave.email + "&token=";
			let logoImage = "logo.png";
			var variableDetails = {
				name: payloadData.name,
				otp: otp,
				ip: env.APP_URLS.API_URL,
				s3logo: env.AWS.S3.s3Url+logoImage,
				resetPasswordToken: env.APP_URLS.API_URL + path + generatedString,	
				termsUrl: env.PAGESURL.termsUrl, 
				privacyUrl: env.PAGESURL.privacyUrl
			};
			await Mailer.sendMail("FORGOT_PASSWORD_RECRUITER", recruiterUsersSave.email, variableDetails);
			await Services.RecruiterService.updateData(criteria, { forgotPasswordOtp: otp,  forgotPasswordToken: newToken });
		} else throw Response.error_msg.implementationError;
	},
	updateRecruiterUsers: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			fullName: Joi.string().optional(),
			phoneNumber: Joi.string().optional(),
			title: Joi.string().optional(),
			linkedin: Joi.string().optional(),
			assignGroupIds: Joi.array().items(Joi.object()).optional(),
			userType: Joi.string().optional(),
			recruiterId: Joi.string().optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
			isArchive: Joi.number().valid(0,1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			groupPermissions: Joi.array().items({
				module: Joi.string().required(),
				permission: Joi.number().valid(0, 1).required(),
			}).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let condition = {
			id: payload.id,
		};
		let recruiterPermissionsDelete= {
			recruiterUserId : payload.id
		};
		let objToSave = {};
	
		if (_.has(payload, "fullName") && payload.fullName != "") objToSave.fullName = payload.fullName;
		if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
		if (_.has(payload, "title") && payload.title != "") objToSave.title = payload.title;
		if (_.has(payload, "linkedin") && payload.linkedin != "") objToSave.linkedin = payload.linkedin;
		if (_.has(payload, "isArchive")) objToSave.isArchive = payload.isArchive;
		if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
		if (_.has(payload, "isDeleted")) objToSave.isDeleted = payload.isDeleted;
		objToSave.recruiterId=payloadData.recruiterId;

		let updateRecruiterUsers = await Services.RecruiterUserService.updateRecruiterUsers(condition, objToSave);
		let condition1 = {
			recruiterId : payloadData.recruiterId
		};
		let saveData = {
			isArchive: objToSave.isArchive
		};
		await Services.BaseService.updateData(Model.Recruiter,condition1, saveData);

		let objToDelete={
			isDeleted:1
		};
		if(payload.isBlocked&&payload.isBlocked.length>0){
			await Services.JobPostService.BlockData(Model.AssignUserGroup,recruiterPermissionsDelete, objToSave);
		}
		if(payload.isDeleted&&payload.isDeleted.length>0){
			await Services.JobPostService.deleteData(Model.AssignUserGroup,recruiterPermissionsDelete,objToDelete);
		}

		let result ={};
		if(updateRecruiterUsers){
			if(payload.assignGroupIds&&payload.assignGroupIds.length>0){
				await Services.BaseService.delete(Model.AssignUserGroup,recruiterPermissionsDelete);
				let assignGroup=payload.assignGroupIds.map(value => ({...value, recruiterUserId:recruiterPermissionsDelete.recruiterUserId}));
				result.adddAssignGroup = await Services.JobPostService.saveBulkCreate(Model.AssignUserGroup,assignGroup);
			}
			let permissionObject = payload.groupPermissions;
			if (payload.groupPermissions) {
				payload.groupPermissions.forEach((groupPermissions) => {
					permissionObject[groupPermissions.module] = groupPermissions.permission;
				});
				await Services.BaseService.updateData(Model.Permission,{ recruiterUserId: payload.id }, permissionObject);
			}
		}
		return message.success.UPDATED;
	},
	

};