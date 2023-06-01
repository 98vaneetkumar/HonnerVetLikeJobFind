const Joi = require("joi");
const _ = require("underscore");
let commonHelper = require("../../helpers/common");
let Services = require("../../services");
let NotificationManager = require("../../helpers/mailer");
let message = require("../../config/messages");
const env = require("../../config/env")();
const Sequelize = require("sequelize");
const baseService =require("../../services/base");
const Models = require("../../models");

module.exports = {
	getAlllisting: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow(""),
				isAdminApproved: Joi.string().optional().allow(""),
				userType: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved"
			];
			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";

			let users = await Services.AdminRecruiterService.getAdminRecruiterList(
				payload, projection, payload.limit || 50, payload.skip || 0,sortBy,orderBy
			);
			let TotalUser = await Services.AdminRecruiterService.countData(payload);
			let blocked = await Services.AdminRecruiterService.countDataBlocked(payload);
			let pending = await Services.AdminRecruiterService.countDataPending(payload);
			let approved = await Services.AdminRecruiterService.countDataApproved(payload);
			let rejected = await Services.AdminRecruiterService.countDataRejected(payload);
			let count = await Services.AdminRecruiterService.countDataIsApproved(payload);
			return {
				count:count,
				listing: users,
				TotalUser: TotalUser,
				Blocked: blocked,
				Pending:pending,
				Approved:approved,
				Rejected:rejected
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getAllSubRecruiterlisting: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow("")
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let criteria ={
			// 	id: payload.id
			// };
			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let projection = ["id", "fullName", "email","phoneNumber","title","linkedin","recruiterId","createdAt","isBlocked","isArchive","lastActivity",
				[Sequelize.literal("(SELECT (recruiter.companyName) FROM recruiter as recruiter where recruiter_users.recruiterId=recruiter.id)"), "companyName"],
				[Sequelize.literal("(SELECT COUNT(DISTINCT job_posts.id) FROM job_posts as job_posts where job_posts.recuiterId = recruiter_users.recruiterId)"), "companyJobs"]
			];

			let count= 	await Services.AdminRecruiterService.countSubRecruiter(payload);
			let listing = await Services.AdminRecruiterService.getAdminSubRecruiterList(
				payload,projection,  payload.limit || 50, payload.skip || 0,sortBy,orderBy
			);	
			return {
				count: count,
				listing: listing
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getSubRecruiterUsersById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			id: payload.id,
		};
		let Projection = ["id", "fullName", "email","phoneNumber","title","linkedin","recruiterId","createdAt","isBlocked","isArchive","lastActivity",
			[Sequelize.literal("(SELECT (recruiter.companyName) FROM recruiter as recruiter where recruiter_users.recruiterId=recruiter.id)"), "companyName"],
			[Sequelize.literal("(SELECT COUNT(DISTINCT job_posts.id) FROM job_posts as job_posts where job_posts.recuiterId = recruiter_users.recruiterId)"), "companyJobs"]
		];
		let details = await Services.AdminRecruiterService.getSubRecruiterDetail(criteria,Projection);
		return {
			details: details
		};
	},
	getCompanyJobsById: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let criteria ={
			// 	id: payload.id
			// };

			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let count= 	await Services.AdminRecruiterService.countCompanyJobs(payload);
			let listing = await Services.AdminRecruiterService.getCompanyJobslisting(
				payload, payload.limit || 50, payload.skip || 0,sortBy,orderBy
			);	
			return {
				count: count,
				listing: listing
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getSubRecruiterJobsById: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let projection = ["id","jobTitle","recuiterId","categoryId","industryId","planId","subRecuiterId",
				"userType","description","workPlaceLocation","location","state","city","zipCode","latitude","longitude",
				"steps","employementTypeId","scheduleId","payOption","price","minimum","maximum","rate","supplementalPayId","jobEligibleForId",
				"vaccinationCerificate","travelRequirementId","noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber",
				"isConfirm","reason","jobClosingTime","createdAt",
				[Sequelize.literal("(SELECT (recruiter_users.fullName) FROM recruiter_users as recruiter_users where recruiter_users.id=job_posts.subRecuiterId )"), "recruiterName"],
				[Sequelize.literal("(SELECT (recruiter_users.email) FROM recruiter_users as recruiter_users where job_posts.subRecuiterId=recruiter_users.id)"), "recruiterEmail"],
				[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
				[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
				[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "employementTypesName"],
				[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
				[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_posts.supplementalPayId= supplements.id)"), "supplementsName"],
				[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_posts.jobEligibleForId=eligibles.id )"), "eligiblesName"],
				[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
				[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "hiresRequired"]
			];
			let count= 	await Services.AdminRecruiterService.countSubRecruiterJobs(payload);
			let listing = await Services.AdminRecruiterService.getSubRecruiterJobslisting(
				payload,projection, payload.limit || 50, payload.skip || 0,sortBy,orderBy
			);	
			return {
				count: count,
				listing: listing
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getSubRecruiterJobsDetailById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			id: payload.id,
		};
		let data = {
			jobPostId: payload.id,
			isDeleted:0
		};
		let projection = ["id","jobTitle","recuiterId","categoryId","industryId","planId","subRecuiterId",
			"userType","description","workPlaceLocation","location","state","city","zipCode","latitude","longitude",
			"steps","employementTypeId","scheduleId","payOption","price","minimum","maximum","rate","supplementalPayId","jobEligibleForId",
			"vaccinationCerificate","travelRequirementId","noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber",
			"isConfirm","reason","jobClosingTime","createdAt",
			[Sequelize.literal("(SELECT (recruiter_users.fullName) FROM recruiter_users as recruiter_users where recruiter_users.id=job_posts.subRecuiterId )"), "recruiterName"],
			[Sequelize.literal("(SELECT (recruiter_users.email) FROM recruiter_users as recruiter_users where job_posts.subRecuiterId=recruiter_users.id)"), "recruiterEmail"],
			[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
			[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
			[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "employementTypesName"],
			[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
			[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_posts.supplementalPayId= supplements.id)"), "supplementsName"],
			[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_posts.jobEligibleForId=eligibles.id )"), "eligiblesName"],
			[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
			[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "hiresRequired"]
		];
		let details = await Services.AdminRecruiterService.getSubRecruiterDetailById(criteria, projection);
		let jobPostAddQuestions = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId",[Sequelize.literal("(SELECT (screening_question.title) FROM screening_question as screening_question where job_post_add_questions.addScreeningQuestionId=screening_question.id )"), "screening_question_name"]]);
		let jobPostBenefits = await baseService.getAllRecordsWithoutCount(Models.JobPostBenefits,data,["id" , "benefitsId",[Sequelize.literal("(SELECT (benefits.name) FROM benefits as benefits where job_post_benefits.benefitsId=benefits.id limit 1)"), "benefitsName"]]);
		let jobPostNotificationEmails = await baseService.getAllRecordsWithoutCount(Models.JobPostNotificationEmails,data,["id","emailId"]);
		let jobPostPersonalities = await baseService.getAllRecordsWithoutCount(Models.JobPostPersonalities,data,["id","personalitiesId",[Sequelize.literal("(SELECT (personalities.name) FROM personalities as personalities where job_post_personalities.personalitiesId=personalities.id )"), "personalitiesName"]]);
		let jobPostSkills = await baseService.getAllRecordsWithoutCount(Models.JobPostSkills,data,["id","skillId",[Sequelize.literal("(SELECT (skills.name) FROM skills as skills where job_post_skills.skillId=skills.id)"), "skillsName"]]);
		let supplementalPay = await baseService.getAllRecordsWithoutCount(Models.JobPostSupplementPay,criteria,["id","supplementalPayId",
			[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_post_supplement_pay.supplementalPayId=supplements.id )"), "supplements_name"]]);	
			
		return {
			details: details,
			jobPostAddQuestions: jobPostAddQuestions,
			jobPostBenefits: jobPostBenefits,
			jobPostNotificationEmails: jobPostNotificationEmails,
			jobPostPersonalities: jobPostPersonalities,
			jobPostSkills: jobPostSkills,
			supplementalPay:supplementalPay

		};
	},
	getSubRecruiterHiredRejectedById: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow(""),
				status: Joi.number().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let projection = ["id","createdAt","updatedAt","userId","jobPostId","status","note","recruiterId","subRecruiterId",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where user_job_notes.recruiterId=recruiter.id)"), "companyName"],
				[Sequelize.literal("(SELECT (recruiter_users.fullName) FROM recruiter_users as recruiter_users where user_job_notes.subRecruiterId=recruiter_users.id)"), "recruiterName"],
				[Sequelize.literal("(SELECT (job_posts.jobTitle) FROM job_posts as job_posts where job_posts.id=user_job_notes.jobPostId)"), "jobTitle"],
				[Sequelize.literal("(SELECT (users.name) FROM users as users where users.id=user_job_notes.userId)"), "userName"]
			];
			let count= 	await Services.AdminRecruiterService.countSubRecruiterCandidate(payload);
			let listing = await Services.AdminRecruiterService.getSubRecruiterCandidateHiredRejectedlisting(
				payload,projection, payload.limit || 50, payload.skip || 0,sortBy,orderBy
			);	
			return {
				count: count,
				listing: listing
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getSubscriptionHistoryDetailById: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			
			let count= 	await Services.AdminRecruiterService.countSubscriptionHistory(payload);
			let listing = await Services.AdminRecruiterService.getSubscriptionHistorylisting(
				payload, payload.limit || 50, payload.skip || 0
			);	
			return {
				count: count,
				listing: listing
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getSubRecruiterHiredRejectedDetailById: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.number().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let projection = ["id","createdAt","updatedAt","userId","jobPostId","status","note","recruiterId","subRecruiterId",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where user_job_notes.recruiterId=recruiter.id)"), "companyName"],
				[Sequelize.literal("(SELECT (recruiter_users.fullName) FROM recruiter_users as recruiter_users where user_job_notes.subRecruiterId=recruiter_users.id)"), "recruiterName"],
				[Sequelize.literal("(SELECT (job_posts.jobTitle) FROM job_posts as job_posts where job_posts.id=user_job_notes.jobPostId)"), "jobTitle"],
				[Sequelize.literal("(SELECT (users.name) FROM users as users where users.id=user_job_notes.userId)"), "userName"]
			];
			let details = await Services.AdminRecruiterService.getSubRecruiterCandidateHiredRejectedDetail(criteria, projection);
			return {
				details: details
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},

	getDetailsById: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required()
			});

			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let projection = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt"
			];
			let detail = await Services.AdminRecruiterService.getDetail(criteria, projection);
			return {
				Details: detail
			};
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	deleteUser: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required()
			});

			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {
				isDeleted:1
			};

			await Services.AdminRecruiterService.updateData(criteria, objToSave);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	userUpdate: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				isBlocked: Joi.number().required()
			});

			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {};

			if (_.has(payload, "isBlocked")) objToSave.isBlocked = payloadData.isBlocked;

			await Services.AdminRecruiterService.updateData(criteria, objToSave);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	adminPermission: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				reason: Joi.string().optional(),
				isAdminApproved: Joi.string().required()
			});
            
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			let objToSave = {
				isAdminApproved:payload.isAdminApproved
			};

			if(objToSave.isAdminApproved=="-1"){
				if (_.has(payloadData, "reason") && payloadData.reason != "") objToSave.reason = payloadData.reason;
			} else if (objToSave.isAdminApproved=="1") {
				objToSave.reason ="Approved";
			}
            
			await Services.AdminRecruiterService.updateData(criteria, objToSave);
			let data= await Services.RecruiterService.getDetail(criteria);
			let logoImage = "logo.png";
			var variableDetails = {
				email: data.email,
				reason: data.reason,
				s3logo: env.AWS.S3.s3Url+logoImage,
				ip: env.APP_URLS.API_URL,
			};

			await NotificationManager.sendMail("RECRUITER_STATUS", data.email, variableDetails);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	}
};