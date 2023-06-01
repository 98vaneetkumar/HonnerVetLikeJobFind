const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const response = require("../../config/response");
const Services = require("../../services");
const baseService =require("../../services/base");
const Models = require("../../models");
const Sequelize = require("sequelize");
const NotificationManager = require("../../helpers/notificationManager");

var projection2=["id","name","email","companyName","companySize","profileImage","location"];
			

module.exports = {
	ApplyJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				jobPostId: Joi.string().required(),
				response:Joi.array().items(Joi.object()).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			let criteriaJob = {
				id : payload.jobPostId
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "jobPostId") && payloadData.jobPostId != "") objToSave.jobPostId = payload.jobPostId;
			
			var projectionJob=["id","isBlocked","isDeleted","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","location","state","city","zipCode","longitude","latitude","employementTypeId","scheduleId","payOption",
				"minimum","maximum","rate", "price","vaccinationCerificate","createdAt","isConfirm","steps"];
			let JobPost = await baseService.getSingleRecord(Models.JobPosts, criteriaJob, projectionJob);
			if (JobPost && JobPost.isBlocked === 1) throw response.error_msg.blockJob;
			if (JobPost && JobPost.isDeleted === 1) throw response.error_msg.deletedJob;
			let count = await Services.UserJobService.count({userId:payload.userId, jobPostId: payload.jobPostId });
			if (count === 0) {
				let create = await Services.UserJobService.saveData(objToSave);
				if (create) {
					if (payload.response && payload.response.length > 0) {
						let questionArray = payload.response;
						let arrAnswer = questionArray.map(value => ({...value, userId: payload.userId, jobPostId: payload.jobPostId, jobApplyId: create.id }));
						await Services.UserJobService.saveBulkData(arrAnswer);
					}
					let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: payload.userId}, ["deviceToken", "deviceType" ], 50, 0);
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
						userId: payload.userId,
						title:"Job Request",
						message:"Your job request for Job "+JobPost.id+" has been sent successfully",
						notificationType:11,
						userType: 0,
						deviceType: 0,
						recruiterId:JobPost.recuiterId,
						jobId:JobPost.id
					};
					var dataNotification ={
						title:"Job Request",
						message:"Your job request for Job "+JobPost.id+" has been sent successfully",
						notificationType:"11",
						flag:"1",
						notificationId : "1",
						jobId:JobPost.id
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
					return message.success.ADDED;
				}
			}else{
				throw response.error_msg.JOB_APPLYED;
			}
		}catch (err){
			console.log(err);
			throw err;
		}	
	},
	getListOfApplyJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				userId: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			var projection=["id","jobTitle","location","payOption","price", "minimum","maximum","rate","createdAt","updatedAt",
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_post.id limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId = job_post.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal(`(SELECT if(count(id)>0,1,0) FROM user_job_apply where jobPostId=job_post.id and userId = '${payload.userId}' limit 1 )`), "isApplied"],
				[Sequelize.literal(`
(CASE 
  WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_post.id and userId = '${payload.userId}' limit 1) > 0 
  THEN 1 
  ELSE 0 
END)
`),
				"isApplyed"]			
			];
			result.count= 	await Services.UserJobService.count(payload);
			result.data = await Services.UserJobService.getListing(
				payload,projection,projection2, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	getDetailOfApplyJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let result={};
			result.detail = await Services.UserJobService.getAllRecords(criteria,["id","userId","jobPostId",
				[Sequelize.literal("(SELECT (users.name) FROM users as users where user_job_apply.userId=users.id )"), "UserName"],
				[Sequelize.literal("(SELECT (job_posts.jobTitle) FROM job_posts as job_posts where user_job_apply.jobPostId=job_posts.id )"), "Job_title"]]);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	updateApplyJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				userId: Joi.string().optional(),
				jobPostId: Joi.string().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "jobPostId")&& payloadData.jobPostId != "") objToUpdate.jobPostId = payload.jobPostId;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			await Services.UserJobService.updateData(criteria, objToUpdate);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	deletedApplyJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				userId: Joi.string().optional(),
				jobPostId: Joi.string().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				jobPostId: payload.jobPostId,
				userId: payload.userId
			};
			let objToUpdate = {};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "jobPostId")&& payloadData.jobPostId != "") objToUpdate.jobPostId = payload.jobPostId;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			await Services.UserJobService.hardDelete(criteria);
			return message.success.DELETED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	saveJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				jobPostId: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			let criteria = {
				jobPostId: payload.jobPostId,
				userId: payload.userId,
			};
			let count= 	await Services.UserJobService.countJobApp(criteria);

			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "jobPostId") && payloadData.jobPostId != "") objToSave.jobPostId = payload.jobPostId;
			if (count===0) {
				let create = await Services.UserJobService.saveJob(objToSave);
				if (create) {
					return message.success.ADDED;
				}
			}else{
				await Services.UserJobService.deleteSaveJob(criteria);
				await Services.UserJobService.saveJob(objToSave);
				throw response.error_msg.JOB_SAVED;
			}	
		}catch (err){
			console.log(err);
			throw err;
		}	
	},
	getListOfSaveJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				userId: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			var projection=["id","jobTitle","location","payOption","price","minimum","maximum","rate","createdAt","updatedAt",	
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_post.id limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId = job_post.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal("(SELECT 1)"), "isSaved"],		
				[Sequelize.literal(`
				(CASE 
				  WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_post.id and userId = '${payload.userId}' and isDeleted=0 limit 1) > 0 
				  THEN 1 
				  ELSE 0 
				END)
				`),
				"isApplied"]			
			];
			result.count= 	await Services.UserJobService.countJob(payload);
			result.data = await Services.UserJobService.getListingJob(
				payload,projection,projection2, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	getDetailOfSaveJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let result={};
			result.detail = await baseService.getAllRecords(Models.UserSavePostJob,criteria,["id","userId","jobPostId",
				[Sequelize.literal("(SELECT (users.name) FROM users as users where user_job_post_save.userId = users.id )"), "UserName"],
				[Sequelize.literal("(SELECT (job_posts.jobTitle) FROM job_posts as job_posts where user_job_post_save.jobPostId=job_posts.id )"), "Job_title"]]);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	updateSaveJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				userId: Joi.string().optional(),
				jobPostId: Joi.number().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToUpdate = {};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "jobPostId")&& payloadData.jobPostId != "") objToUpdate.jobPostId = payload.jobPostId;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			await Services.UserJobService.updateJob(criteria, objToUpdate);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	deleteSaveJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				jobPostId: Joi.string().required(),
				userId: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				jobPostId: payload.jobPostId,
				userId: payload.userId,
			};
			await Services.UserJobService.deleteSaveJob(criteria);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getDetailOfApplyJobForSpeificPost: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				jobPostId: payload.id,
				isDeleted:0
			};
			let result={};
			result.count=await Services.UserJobService.count(criteria);
			result.detail = await Services.UserJobService.getAllDetail(criteria,["id","userId","jobPostId"]);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	recruiterlist: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				userId: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			console.log("this is payload",payload);
			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved",
				[Sequelize.literal("(SELECT count(id) FROM job_posts where recuiterId=recruiter.id limit 1)"), "countJobPost"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal(`(SELECT count(DISTINCT J1.id) FROM job_posts J1 Left join job_post_skills JK on J1.id=JK.jobPostId WHERE J1.recuiterId = recruiter.id AND JK.skillId in (SELECT skillId FROM user_skills WHERE userId = "${payload.userId}"))`), "matchingJobsCount"]
			];
			let criteriaRecruiter = {
				isAdminApproved: "1", 
				userType: "SUPER_RECRUITER",
				isDeleted:0,
				isBlocked:0,
			};
			result.count = 	await Services.RecruiterService.countApp(payload, criteriaRecruiter);
			result.data = await Services.RecruiterService.getAllAPPRecruiter(
				payload, criteriaRecruiter, projectionRecruiter, payload.limit || 10, payload.skip || 0);			
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}
	},
	recruiterDetails: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().optional(),
				id:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			console.log(payload,"dsafdasssssssss");
			let result;
			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved",
				[Sequelize.literal(`(SELECT if(count(id)>0,1,0) FROM user_turn_off_notification where recruiterId = '${payload.id}' limit 1 )`), "notificationTurnOff"],
				
			];
			let criteriaRecruiter = {
				isAdminApproved: "1", 
				userType: "SUPER_RECRUITER",
				isDeleted:0,
				isBlocked:0,
				id:payload.id
			};
			result = await Services.RecruiterService.getDetail(
				criteriaRecruiter, projectionRecruiter);			
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}
	},
};