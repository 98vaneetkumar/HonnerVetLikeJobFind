const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const Services = require("../../services");
const Models = require("../../models");
const baseService =require("../../services/base");
const Sequelize = require("sequelize");
const NotificationManager = require("../../helpers/notificationManager");
var projection=["id","isBlocked","isDeleted","createdAt","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","scheduleId","payOption",
	"minimum","maximum","rate", "price","jobEligibleForId","vaccinationCerificate","travelRequirementId","userType","subRecuiterId",
	"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt","isConfirm",
	[Sequelize.literal("(SELECT (recruiter.email) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "Recruiter_Email"],
	[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
	[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
	[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
	[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
	[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"],
];

module.exports = {
	save: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				jobTitle: Joi.string().optional(),
				categoryId: Joi.string().optional(),
				jobAssignedEachPlan: Joi.string().optional(),
				industryId: Joi.string().optional(),
				recuiterId: Joi.string().optional(),
				description: Joi.string().optional(),
				workPlaceLocation: Joi.string().optional(),
				location: Joi.string().optional(),
				state: Joi.string().optional(),
				city: Joi.string().optional(),
				zipCode: Joi.string().optional(),
				latitude: Joi.string().optional(),
				longitude: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				subRecuiterId: Joi.string().optional(),
				scheduleId:Joi.string().optional(),
				payOption:Joi.string().optional(),
				minimum:Joi.number().optional(),
				maximum:Joi.number().optional(),
				price:Joi.number().optional(),
				rate:Joi.string().optional(),
				steps:Joi.number().optional(),
				vaccinationCerificate:Joi.number().optional(),
				travelRequirementId:Joi.string().optional(),
				noOfPeopleRequired:Joi.number().optional(),
				quicklyNeedForHireId:Joi.string().optional(),
				countryCode:Joi.string().optional(),
				phoneNumber:Joi.string().optional(),
				isConfirm:Joi.number().valid(0,1).optional(),
				id:Joi.string().optional(),
				address: Joi.array().items(Joi.object()).optional(),
				//Job required skill add 
				skillIds: Joi.array().items(Joi.object()).optional(),
				personalitiesIds: Joi.array().items(Joi.object()).optional(),
				emailsIds: Joi.array().items(Joi.object()).optional(),
				benefitsIds: Joi.array().items(Joi.object()).optional(),
				//Add question skills
				addScreeningQuestionIds: Joi.array().items(Joi.object()).optional(),
				//Add custom questions
				addCustomQuestion:Joi.array().items(Joi.object()).optional(),	
				jobEligibleForId:Joi.array().items(Joi.object()).optional(),
				supplementalPayId:Joi.array().items(Joi.object()).optional(),	
				subCategoryId:Joi.array().items(Joi.object()).optional(),	
			});
          
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToSave.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "categoryId") && payloadData.categoryId != "") objToSave.categoryId = payload.categoryId;
			if (_.has(payloadData, "industryId") && payloadData.industryId != "") objToSave.industryId = payload.industryId;
			if (_.has(payloadData, "jobAssignedEachPlan") && payloadData.jobAssignedEachPlan != "") objToSave.jobAssignedEachPlan = payload.jobAssignedEachPlan;
			if (_.has(payloadData, "viewAssignedEachPlan") && payloadData.viewAssignedEachPlan != "") objToSave.viewAssignedEachPlan = payload.viewAssignedEachPlan;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "workPlaceLocation") && payloadData.workPlaceLocation != "") objToSave.workPlaceLocation = payload.workPlaceLocation;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "scheduleId") && payloadData.scheduleId != "") objToSave.scheduleId = payload.scheduleId;
			if (_.has(payloadData, "payOption") && payloadData.payOption != "") objToSave.payOption = payload.payOption;
			if (_.has(payloadData, "minimum") && payloadData.minimum != "") objToSave.minimum = payload.minimum;
			if (_.has(payloadData, "maximum") && payloadData.maximum != "") objToSave.maximum = payload.maximum;
			if (_.has(payloadData, "rate") && payloadData.rate != "") objToSave.rate = payload.rate;
			if (_.has(payloadData, "price") && payloadData.price != "") objToSave.price = payload.price;
			if (_.has(payloadData, "vaccinationCerificate") && payloadData.vaccinationCerificate != "") objToSave.vaccinationCerificate = payload.vaccinationCerificate;
			if (_.has(payloadData, "travelRequirementId") && payloadData.travelRequirementId != "") objToSave.travelRequirementId = payload.travelRequirementId;
			if (_.has(payloadData, "noOfPeopleRequired") && payloadData.noOfPeopleRequired != "") objToSave.noOfPeopleRequired = payload.noOfPeopleRequired;
			if (_.has(payloadData, "quicklyNeedForHireId") && payloadData.quicklyNeedForHireId != "") objToSave.quicklyNeedForHireId = payload.quicklyNeedForHireId;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "isConfirm") ) objToSave.isConfirm = payload.isConfirm;
			if (_.has(payloadData, "steps")) objToSave.steps = payload.steps;
			objToSave.recuiterId=payload.id;
			let objToFind={
				id:payload.id
			};
			let userType=await Services.RecruiterService.getUserType(objToFind,["id","userType","email"]);
			objToSave.userType=userType.dataValues.userType;
			
			if(userType.dataValues.userType==="SUB_RECRUITER"){
				let obj={
					email:userType.dataValues.email
				};
				let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
				objToSave.subRecuiterId=userId.dataValues.id;
			}
			let result={};
			console.log("obj to save======>",objToSave.location);

			if(payload.address&&payload.address.length>0){
				payload.address.forEach(async (addr) => {
					objToSave.location=addr.location;
					objToSave.state=addr.state;
					objToSave.city=addr.city;
					objToSave.latitude=addr.latitude;
					objToSave.longitude=addr.longitude;
					objToSave.zipCode=addr.zipCode;
					let addJob = await Services.JobPostService.saveData(objToSave);
					result.add=addJob;
		
					if(addJob){
						if(payload.skillIds&& payload.skillIds.length>0){
							let skillPostArray=payload.skillIds.map(value => ({...value, jobPostId:addJob.id, recuiterId:payload.id}));
							result.addSkill = await Services.JobPostService.saveBulkCreate(Models.JobPostSkills,skillPostArray);	 
						}
						if(payload.personalitiesIds&&payload.personalitiesIds.length>0){
							let personalitiesArray=payload.personalitiesIds.map(value => ({...value, jobPostId:addJob.id}));
							result.addPersonalities = await Services.JobPostService.saveBulkCreate(Models.JobPostPersonalities,personalitiesArray);
						
						}
						if(payload.emailsIds&&payload.emailsIds.length>0){
							let emailNotification=payload.emailsIds.map(value => ({...value, jobPostId:addJob.id}));
							result.addemailsIds = await Services.JobPostService.saveBulkCreate(Models.JobPostNotificationEmails,emailNotification); 
						}
						if(payload.benefitsIds&&payload.benefitsIds.length>0){
							let benifit=payload.benefitsIds.map(value => ({...value, jobPostId:addJob.id}));
							result.addBenifits = await Services.JobPostService.saveBulkCreate(Models.JobPostBenefits,benifit);
						}
						if(payload.addCustomQuestion&&payload.addCustomQuestion.length>0){
							let objArray=payload.addCustomQuestion.map(value => ({...value, jobPostId:addJob.id,recuiterId:payload.id}));
							result.addCustomQuestion = await Services.JobPostService.saveBulkCreate(Models.JobPostAddQuestions,objArray);    
						}
						if(payload.address&&payload.address.length>0){
							let addresses=payload.address.map(value => ({...value, jobPostId:addJob.id}));
							result.addCustomQuestion = await Services.JobPostService.saveBulkCreate(Models.JobPostAddress,addresses);    
						}
						if(payload.jobEligibleForId&&payload.jobEligibleForId.length>0){
							let jobEligibleFor=payload.jobEligibleForId.map(value => ({...value, jobPostId:addJob.id}));
							result.JobPostEligibleFor = await Services.JobPostService.saveBulkCreate(Models.JobPostEligibleFor,jobEligibleFor);    
						}
						if(payload.supplementalPayId&&payload.supplementalPayId.length>0){
							let supplementalPayId=payload.supplementalPayId.map(value => ({...value, jobPostId:addJob.id}));
							result.supplementalPayId = await Services.JobPostService.saveBulkCreate(Models.JobPostSupplementPay,supplementalPayId);    
						}
						if(payload.subCategoryId&&payload.subCategoryId.length>0){
							let subCategory=payload.subCategoryId.map(value => ({...value, jobPostId:addJob.id}));
							result.subCategory = await Services.JobPostService.saveBulkCreate(Models.JobPostSubCategory,subCategory);    
						}
					}
				});
			}else{
				let addJob = await Services.JobPostService.saveData(objToSave);
				result.add=addJob;
				if(addJob){
					if(payload.skillIds&& payload.skillIds.length>0){
						let skillPostArray=payload.skillIds.map(value => ({...value, jobPostId:addJob.id, recuiterId:payload.recuiterId}));
						result.addSkill = await Services.JobPostService.saveBulkCreate(Models.JobPostSkills,skillPostArray);	 
					}
					if(payload.personalitiesIds&&payload.personalitiesIds.length>0){
						let personalitiesArray=payload.personalitiesIds.map(value => ({...value, jobPostId:addJob.id}));
						result.addPersonalities = await Services.JobPostService.saveBulkCreate(Models.JobPostPersonalities,personalitiesArray);  
					}
					if(payload.emailsIds&&payload.emailsIds.length>0){
						let emailNotification=payload.emailsIds.map(value => ({...value, jobPostId:addJob.id}));
						result.addemailsIds = await Services.JobPostService.saveBulkCreate(Models.JobPostNotificationEmails,emailNotification); 
					}
					if(payload.benefitsIds&&payload.benefitsIds.length>0){
						let benifit=payload.benefitsIds.map(value => ({...value, jobPostId:addJob.id}));
						result.addBenifits = await Services.JobPostService.saveBulkCreate(Models.JobPostBenefits,benifit);
					}
					if(payload.addCustomQuestion&&payload.addCustomQuestion.length>0){
						let objArray=payload.addCustomQuestion.map(value => ({...value, jobPostId:addJob.id,recuiterId:payload.recuiterId}));
						result.addCustomQuestion = await Services.JobPostService.saveBulkCreate(Models.JobPostAddQuestions,objArray);    
					}
					if(payload.jobEligibleForId&&payload.jobEligibleForId.length>0){
						let jobEligibleFor=payload.jobEligibleForId.map(value => ({...value, jobPostId:addJob.id}));
						result.JobPostEligibleFor = await Services.JobPostService.saveBulkCreate(Models.JobPostEligibleFor,jobEligibleFor);    
					}
					if(payload.supplementalPayId&&payload.supplementalPayId.length>0){
						let supplementalPayId=payload.supplementalPayId.map(value => ({...value, jobPostId:addJob.id}));
						result.supplementalPayId = await Services.JobPostService.saveBulkCreate(Models.JobPostSupplementPay,supplementalPayId);    
					}
					if(payload.subCategoryId&&payload.subCategoryId.length>0){
						let subCategory=payload.subCategoryId.map(value => ({...value, jobPostId:addJob.id}));
						result.subCategory = await Services.JobPostService.saveBulkCreate(Models.JobPostSubCategory,subCategory);    
					}
				}
			}
			if (result) {
				return {
					result:result,
					message:message.success.ADDED
				};
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
				employementTypeId: Joi.array().optional().allow(""),
				minimum: Joi.string().optional().allow(""),
				maximum: Joi.string().optional().allow(""),
				rate: Joi.string().optional().allow(""),
				industryId: Joi.array().items().optional().allow(""),
				categoryId: Joi.array().optional().allow(""),
				location: Joi.string().optional().allow(""),
				jobTitle: Joi.string().optional().allow(""),
				benefitsId: Joi.array().optional().allow(""),
				jobEligibleForId:Joi.array().optional(),
				travelRequirementId:Joi.array().items().optional(),
				personalitiesIds: Joi.array().items().optional(),
				scheduleId:Joi.array().items().optional(),
				workPlaceLocation:Joi.array().items().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId","travelRequirementId","scheduleId","workPlaceLocation","location","state","city","zipCode","longitude","latitude", "payOption", "location","price","maximum", "minimum", "noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt","isConfirm","isBlocked","isDeleted","steps","userType","subRecuiterId",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "recruiterName"],	
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id AND isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' AND isDeleted=0  limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT count(id) FROM job_post_notification_emails where jobPostId=job_posts.id  limit 1)"), "suggestedCandidateCount"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal(`
(CASE 
  WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id AND isDeleted=0  limit 1) > 0 
  THEN 1 
  ELSE 0 
END)
`),
				"isApplyed"]
			];
			payload.isBlocked=0;
			payload.isConfirm=1;
			let result= {};
			result.count=await Services.JobPostService.count(payload);
			result.listing = await Services.JobPostService.getAppListing(
				payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
           
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}
	},
	getListForWeb: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				recruiterId:Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
				employementTypeId: Joi.array().optional().allow(""),
				minimum: Joi.string().optional().allow(""),
				maximum: Joi.string().optional().allow(""),
				rate: Joi.string().optional().allow(""),
				industryId: Joi.array().items().optional().allow(""),
				categoryId: Joi.array().optional().allow(""),
				location: Joi.string().optional().allow(""),
				jobTitle: Joi.string().optional().allow(""),
				benefitsId: Joi.array().optional().allow(""),
				jobEligibleForId:Joi.array().optional(),
				travelRequirementId:Joi.array().items().optional(),
				personalitiesIds: Joi.array().items().optional(),
				scheduleId:Joi.array().items().optional(),
				workPlaceLocation:Joi.array().items().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId","travelRequirementId","scheduleId","workPlaceLocation","location","state","city","zipCode","longitude","latitude", "payOption", "location","price","maximum", "minimum", "noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt","isConfirm","isBlocked","isDeleted","steps","userType","subRecuiterId",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "recruiterName"],	
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id AND isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' AND isDeleted=0  limit 1)`), "saveStatus"],
				[Sequelize.literal(`(SELECT COUNT(DISTINCT(user_skills.userId)) FROM user_skills as user_skills INNER JOIN job_post_skills as job_post_skills ON job_post_skills.skillId = user_skills.skillId
				WHERE job_post_skills.jobPostId = job_posts.id AND
				user_skills.userId NOT IN (SELECT * FROM
				((SELECT userId FROM user_job_apply WHERE jobPostId = job_posts.id AND isDeleted = 0)
				UNION ALL
				(SELECT userId FROM suggested_hide WHERE jobPostId = job_posts.id )
				) as sub_query
				))`), "suggestedCandidateCount"],  
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal("(SELECT CONCAT('JOB', RIGHT(id, 7)) AS new_id ORDER BY new_id ASC)"),"newId"],
			];
		
			let result= {};
			result.count=await Services.JobPostService.count(payload);
			result.listing = await Services.JobPostService.getAppListing(
				payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
           
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
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				jobPostId: payload.id,
				isDeleted:0
			};
			let data={
				id:payload.id,
				isDeleted:0
			};
			var projectionJob=["id","isBlocked","isDeleted","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","location","state","city","zipCode","longitude","latitude","employementTypeId","scheduleId","payOption",
				"minimum","maximum","rate", "price","vaccinationCerificate","travelRequirementId","userType","subRecuiterId",
				"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt","isConfirm","steps",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "recruiterName"],	
				[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
				[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
				[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "EmploymentTypesName"],
				[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
				[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
				[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"],
				// [Sequelize.literal(`(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' AND isDeleted=0 limit 1)`), "isApplyed"],
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal("(SELECT CONCAT('JOB', RIGHT(id, 7)) AS new_id ORDER BY new_id ASC)"),"newId"],
				// [Sequelize.literal(`
				// (CASE 
				//   WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id AND isDeleted=0  limit 1) > 0 
				//   THEN 1 
				//   ELSE 0 
				// END)
				// `),
				// 				"isApplied"]
				[Sequelize.literal(`
(CASE 
  WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' AND isDeleted =0 limit 1) > 0 
  THEN 1 
  ELSE 0 
END)
`),
				"isApplyed"]
			];
			let JobPost = await baseService.getSingleRecord(Models.JobPosts,data,projectionJob);
			console.log("this is job post",JobPost);
			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved"
			];
			console.log(JobPost.recuiterId, "JobPost");
			let criteriaRecruiter = {
				id: JobPost.recuiterId
			};
			let result={};
			result.JobPost = JobPost;
			result.JobPostAddQuestions = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId",
				[Sequelize.literal("(SELECT (screening_question.question) FROM screening_question as screening_question where job_post_add_questions.addScreeningQuestionId=screening_question.id )"), "screening_question_name"],
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_post_add_questions.recuiterId=recruiter.id )"), "recruiter_name"]
			]);
			result.JobPostBenefits = await baseService.getAllRecordsWithoutCount(Models.JobPostBenefits,criteria,["id" , "benefitsId",
				[Sequelize.literal("(SELECT (benefits.name) FROM benefits as benefits where job_post_benefits.benefitsId=benefits.id limit 1)"), "benefitsName"]]);
			result.JobPostNotificationEmails = await baseService.getAllRecordsWithoutCount(Models.JobPostNotificationEmails,criteria,["id","emailId"]);
			result.JobPostPersonalities = await baseService.getAllRecordsWithoutCount(Models.JobPostPersonalities,criteria,["id","personalitiesId",
				[Sequelize.literal("(SELECT (personalities.name) FROM personalities as personalities where job_post_personalities.personalitiesId=personalities.id )"), "personalitiesName"]]);
			result.JobPostSkills = await baseService.getAllRecordsWithoutCount(Models.JobPostSkills,criteria,["id","skillId",
				[Sequelize.literal("(SELECT (skills.name) FROM skills as skills where job_post_skills.skillId=skills.id)"), "skillsName"]]);
			result.JobPostAddQuestions = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId","recuiterId","title","experience","responseType","answer",
				[Sequelize.literal("(SELECT (screening_question.question) FROM screening_question as screening_question where job_post_add_questions.addScreeningQuestionId=screening_question.id )"), "screening_question_name"],
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_post_add_questions.recuiterId=recruiter.id )"), "recruiter_name"]]);
			result.address = await baseService.getAllRecordsWithoutCount(Models.JobPostAddress,criteria);	
			result.jobEligibleFor = await baseService.getAllRecordsWithoutCount(Models.JobPostEligibleFor,criteria,["id","jobEligibleForId",
				[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_post_eligible_for.jobEligibleForId=eligibles.id )"), "eligibles_name"]]);	
			result.supplementalPay = await baseService.getAllRecordsWithoutCount(Models.JobPostSupplementPay,criteria,["id","supplementalPayId",
				[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_post_supplement_pay.supplementalPayId=supplements.id )"), "supplements_name"]]);	
			result.recruiter = await Services.RecruiterService.getDetail(criteriaRecruiter, projectionRecruiter);	
			result.subCategory = await baseService.getAllRecordsWithoutCount(Models.JobPostSubCategory,criteria,["id","categoryId","subCategoryId","others","jobPostId",
				[Sequelize.literal("(SELECT (sub_categories.name) FROM sub_categories as sub_categories where job_post_sub_category.subCategoryId=sub_categories.id )"), "subCategoryName"]]);	
			result.recruiter = await Services.RecruiterService.getDetail(criteriaRecruiter, projectionRecruiter);	
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	update: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				jobTitle: Joi.string().optional(),
				categoryId: Joi.string().optional(),
				recuiterId: Joi.string().optional(),
				industryId: Joi.string().optional(),
				subRecuiterId: Joi.string().optional(),
				jobAssignedEachPlan: Joi.string().optional(),
				viewAssignedEachPlan: Joi.string().optional(),
				description: Joi.string().optional(),
				workPlaceLocation: Joi.string().optional(),
				location: Joi.string().optional(),
				state: Joi.string().optional(),
				city: Joi.string().optional(),
				zipCode: Joi.string().optional(),
				latitude: Joi.string().optional(),
				longitude: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				isDeleted: Joi.number().valid(0, 1).optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
				scheduleId:Joi.string().optional(),
				payOption:Joi.string().optional(),
				minimum:Joi.number().optional(),
				maximum:Joi.number().optional(),
				price:Joi.number().optional(),
				rate:Joi.string().optional(),
				steps:Joi.number().optional(),
				vaccinationCerificate:Joi.number().optional(),
				travelRequirementId:Joi.string().optional(),
				noOfPeopleRequired:Joi.number().optional(),
				quicklyNeedForHireId:Joi.string().optional(),
				countryCode:Joi.string().optional(),
				phoneNumber:Joi.string().optional(),
				isConfirm:Joi.number().valid(0,1).optional(),
				//Job required skill add 
				skillIds: Joi.array().items(Joi.object()).optional(),
				personalitiesIds: Joi.array().items(Joi.object()).optional(),
				emailsIds: Joi.array().items(Joi.object()).optional(),
				benefitsIds: Joi.array().items(Joi.object()).optional(),
				//Add question skills
				addScreeningQuestionIds: Joi.array().items(Joi.object()).optional(),
				//Add custom questions
				addCustomQuestion:Joi.array().items(Joi.object()).optional(),
				address: Joi.array().items(Joi.object()).optional(),
				jobEligibleForId:Joi.array().items(Joi.object()).optional(),
				supplementalPayId:Joi.array().items(Joi.object()).optional(),
				subCategoryId:Joi.array().items(Joi.object()).optional(),	
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id,
			};
			console.log(payload,"payload");
			let objToUpdate = {};
			if(payload.address&&payload.address.length>0){
				objToUpdate.location=payload.address[0].location;
				objToUpdate.state=payload.address[0].state	;
				objToUpdate.city=payload.address[0].city;
				objToUpdate.zipCode=payload.address[0].zipCode;
				objToUpdate.latitude=payload.address[0].latitude;
				objToUpdate.longitude=payload.address[0].longitude;
			}
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToUpdate.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "categoryId")) objToUpdate.categoryId = payload.categoryId;
			if (_.has(payloadData, "industryId") && payloadData.industryId != "") objToUpdate.industryId = payload.industryId;
			objToUpdate.recuiterId=payload.recuiterId;
			if (_.has(payloadData, "jobAssignedEachPlan")&& payloadData.jobAssignedEachPlan != "" ) objToUpdate.jobAssignedEachPlan = payload.jobAssignedEachPlan;
			if (_.has(payloadData, "viewAssignedEachPlan")&& payloadData.viewAssignedEachPlan != "" ) objToUpdate.viewAssignedEachPlan = payload.viewAssignedEachPlan;
			if (_.has(payloadData, "description")&& payloadData.description != "" ) objToUpdate.description = payload.description;
			if (_.has(payloadData, "workPlaceLocation")&& payloadData.workPlaceLocation != "" ) objToUpdate.workPlaceLocation = payload.workPlaceLocation;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payload.isDeleted;
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			if (_.has(payloadData, "scheduleId") && payloadData.scheduleId != "") objToUpdate.scheduleId = payload.scheduleId;
			if (_.has(payloadData, "payOption") && payloadData.payOption != "") objToUpdate.payOption = payload.payOption;
			if (_.has(payloadData, "price") && payloadData.price != "") objToUpdate.price = payload.price;
			if (_.has(payloadData, "minimum") && payloadData.minimum != "") objToUpdate.minimum = payload.minimum;
			if (_.has(payloadData, "maximum") && payloadData.maximum != "") objToUpdate.maximum = payload.maximum;
			if (_.has(payloadData, "rate") && payloadData.rate != "") objToUpdate.rate = payload.rate;
			if (_.has(payloadData, "vaccinationCerificate") && payloadData.vaccinationCerificate != "") objToUpdate.vaccinationCerificate = payload.vaccinationCerificate;
			if (_.has(payloadData, "travelRequirementId") && payloadData.travelRequirementId != "") objToUpdate.travelRequirementId = payload.travelRequirementId;
			if (_.has(payloadData, "noOfPeopleRequired") && payloadData.noOfPeopleRequired != "") objToUpdate.noOfPeopleRequired = payload.noOfPeopleRequired;
			if (_.has(payloadData, "quicklyNeedForHireId") && payloadData.quicklyNeedForHireId != "") objToUpdate.quicklyNeedForHireId = payload.quicklyNeedForHireId;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToUpdate.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToUpdate.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "isConfirm") ) objToUpdate.isConfirm = payload.isConfirm;
			if (_.has(payloadData, "steps")) objToUpdate.steps = payload.steps;
			
			let criteriaForDelete={
				jobPostId:payload.id
			};
			let objToDelete={
				isDeleted:1
			};
			let objToFind={
				id:payload.recuiterId
			};
			let userType=await Services.RecruiterService.getUserType(objToFind,["id","userType","email"]);
			objToUpdate.userType=userType.dataValues.userType;
			
			if(userType.dataValues.userType==="SUB_RECRUITER"){
				let obj={
					email:userType.dataValues.email
				};
				let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
				objToUpdate.subRecuiterId=userId.dataValues.id;
			}
			let addJob=await Services.JobPostService.updateData(criteria, objToUpdate);
			if(addJob&&payload.isDeleted&&payload.isDeleted.length>0){
				await Services.JobPostService.deleteData(Models.JobPostSkills,criteriaForDelete, objToDelete);
				await Services.JobPostService.deleteData(Models.JobPostPersonalities,criteriaForDelete, objToDelete);
				await Services.JobPostService.deleteData(Models.JobPostNotificationEmails,criteriaForDelete, objToDelete);
				await Services.JobPostService.deleteData(Models.JobPostBenefits,criteriaForDelete, objToDelete);
				await Services.JobPostService.deleteData(Models.JobPostAddQuestions,criteriaForDelete, objToDelete);
			}
			if(addJob&&payload.isBlocked&&payload.isBlocked.length>0){
				// await Services.JobPostService.BlockData(Models.JobPosts,criteriaForDelete, objToUpdate);
				await Services.JobPostService.BlockData(Models.JobPostSkills,criteriaForDelete, objToUpdate);
				await Services.JobPostService.BlockData(Models.JobPostPersonalities,criteriaForDelete, objToUpdate);
				await Services.JobPostService.BlockData(Models.JobPostNotificationEmails,criteriaForDelete, objToUpdate);
				await Services.JobPostService.BlockData(Models.JobPostBenefits,criteriaForDelete, objToUpdate);
				await Services.JobPostService.BlockData(Models.JobPostAddQuestions,criteriaForDelete, objToUpdate);
			}
			let result={};
			result.add=addJob;
			result.payload=payload;
			if(payload.skillIds&& payload.skillIds.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostSkills,criteriaForDelete);
				let skillPostArray=payload.skillIds.map(value => ({...value, jobPostId:payload.id, recuiterId:payload.recuiterId}));
				result.addSkill = await Services.JobPostService.saveBulkCreate(Models.JobPostSkills,skillPostArray);	 
			}
			if(payload.personalitiesIds&&payload.personalitiesIds.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostPersonalities,criteriaForDelete);
				let personalitiesArray=payload.personalitiesIds.map(value => ({...value, jobPostId:payload.id}));
				result.addPersonalities = await Services.JobPostService.saveBulkCreate(Models.JobPostPersonalities,personalitiesArray);  
			}
			if(payload.emailsIds&&payload.emailsIds.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostNotificationEmails,criteriaForDelete);
				let emialNotification=payload.emailsIds.map(value => ({...value, jobPostId:payload.id}));
				result.addemailsIds = await Services.JobPostService.saveBulkCreate(Models.JobPostNotificationEmails,emialNotification); 
			}
			if(payload.benefitsIds&&payload.benefitsIds.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostBenefits,criteriaForDelete);
				let benifit=payload.benefitsIds.map(value => ({...value, jobPostId:payload.id}));
				result.addBenifits = await Services.JobPostService.saveBulkCreate(Models.JobPostBenefits,benifit);
			}
			if(payload.address&&payload.address.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostAddress,criteriaForDelete);
				let addresses=payload.address.map(value => ({...value, jobPostId:payload.id}));
				result.address = await Services.JobPostService.saveBulkCreate(Models.JobPostAddress,addresses);    
			}
			if(payload.addCustomQuestion&&payload.addCustomQuestion.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostAddQuestions,criteriaForDelete);
				let objArray=payload.addCustomQuestion.map(value => ({...value, jobPostId:payload.id,recuiterId:payload.recuiterId}));
				console.log("This is obj To save========>",objArray);
				result.addCustomQuestion = await Services.JobPostService.saveBulkCreate(Models.JobPostAddQuestions,objArray);    
			}
			if(payload.jobEligibleForId&&payload.jobEligibleForId.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostEligibleFor,criteriaForDelete);
				let jobEligibleFor=payload.jobEligibleForId.map(value => ({...value, jobPostId:payload.id}));
				result.JobPostEligibleFor = await Services.JobPostService.saveBulkCreate(Models.JobPostEligibleFor,jobEligibleFor);    
			}
			if(payload.supplementalPayId&&payload.supplementalPayId.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostSupplementPay,criteriaForDelete);
				let supplementalPayId=payload.supplementalPayId.map(value => ({...value, jobPostId:payload.id}));
				result.supplementalPayId = await Services.JobPostService.saveBulkCreate(Models.JobPostSupplementPay,supplementalPayId);    
			}
			if(payload.subCategoryId&&payload.subCategoryId.length>0){
				await Services.JobPostService.hardDelete(Models.JobPostSubCategory,criteriaForDelete);
				let subCategory=payload.subCategoryId.map(value => ({...value, jobPostId:addJob.id}));
				result.subCategory = await Services.JobPostService.saveBulkCreate(Models.JobPostSubCategory,subCategory);    
			}
			if (result) {
				return {
					result:result,
					message:message.success.UPDATED,
				};
			}
			
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getRecommandedJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			// let data={
			// 	userId:payload.userId,
			// 	isDeleted:0
			// };
			var projection=["id","isBlocked","isDeleted","createdAt","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","location","employementTypeId","scheduleId","payOption",
				"minimum","maximum","rate", "price", "supplementalPayId","jobEligibleForId","vaccinationCerificate","travelRequirementId",
				"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt",
				[Sequelize.literal("(SELECT (recruiter.email) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "Recruiter_Email"],
				[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
				[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
				[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "EmploymentTypesName"],
				[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
				[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_posts.supplementalPayId= supplements.id)"), "supplementsName"],
				[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_posts.jobEligibleForId=eligibles.id )"), "eligiblesName"],
				[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
				[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"],
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "isApplyed"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"]
			];
			// let userDetail=await baseService.getSingleRecord(Models.UserWorkExperiences,data,["id","jobTitle"]);
			// const jobTitle = userDetail.jobTitle;
			// const jobTitleArray = jobTitle.split(" ");
			let result={};
			// result.JobPost = await Services.JobPostService.getSingleRecord(jobTitleArray);
			result.listing=await Services.JobPostService.getListings(payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0 );
			result.count=await Services.JobPostService.count({});
			
			result.recommandJob=await Services.JobPostService.getListings(payload, projection);
			// result.recommandJob=await Services.JobPostService.getRecommandedJob(data, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	latestJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result={};

			var projection=["id","isBlocked","isDeleted","createdAt","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","employementTypeId","scheduleId","payOption",
				"minimum","maximum","rate", "price", "supplementalPayId","jobEligibleForId","vaccinationCerificate","travelRequirementId",
				"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt",
				[Sequelize.literal("(SELECT (recruiter.email) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "Recruiter_Email"],
				[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
				[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
				[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "EmploymentTypesName"],
				[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
				[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_posts.supplementalPayId= supplements.id)"), "supplementsName"],
				[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_posts.jobEligibleForId=eligibles.id )"), "eligiblesName"],
				[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
				[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"],
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "isApplyed"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"]
			];

			result.listing=await Services.JobPostService.getLatest(payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.count=await Services.JobPostService.count({});
			
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	getPostDetail: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				userId:Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				recuiterId: payload.id,
				isDeleted:0,
			};
			var projection1=["id","isBlocked","isDeleted","createdAt","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","employementTypeId","scheduleId","payOption",
				"minimum","maximum","rate", "price", "supplementalPayId","jobEligibleForId","vaccinationCerificate","travelRequirementId",
				"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt",
				[Sequelize.literal("(SELECT (recruiter.email) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "Recruiter_Email"],
				[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
				[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
				[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "EmploymentTypesName"],
				[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
				[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_posts.supplementalPayId= supplements.id)"), "supplementsName"],
				[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_posts.jobEligibleForId=eligibles.id )"), "eligiblesName"],
				[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"],
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`
(CASE 
  WHEN (SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1) > 0 
  THEN 1 
  ELSE 0 
END)
`),
				"saveStatus"]								
			];
			// let JobPost = await baseService.getAllRecords(Models.JobPosts,criteria,projection);
			let count=await Services.JobPostService.getAllRecordsCount(criteria);
			let JobPost = await  Services.JobPostService.getAllRecordsCompany(criteria,projection1,payload.limit,payload.skip);
			return {count,JobPost};
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	saveJobs: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id:Joi.string().optional(),
				jobTitle: Joi.string().optional(),
				categoryId: Joi.string().optional(),
				jobAssignedEachPlan: Joi.string().optional(),
				industryId: Joi.string().optional(),
				recuiterId: Joi.string().optional(),
				subRecuiterId: Joi.string().optional(),
				description: Joi.string().optional(),
				workPlaceLocation: Joi.string().optional(),
				location: Joi.string().optional(),
				state: Joi.string().optional(),
				city: Joi.string().optional(),
				zipCode: Joi.string().optional(),
				latitude: Joi.string().optional(),
				longitude: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				scheduleId:Joi.string().optional(),
				payOption:Joi.string().optional(),
				minimum:Joi.number().optional(),
				maximum:Joi.number().optional(),
				price:Joi.number().optional(),
				rate:Joi.string().optional(),
				steps:Joi.number().optional(),
				vaccinationCerificate:Joi.number().optional(),
				travelRequirementId:Joi.string().optional(),
				noOfPeopleRequired:Joi.number().optional(),
				quicklyNeedForHireId:Joi.string().optional(),
				countryCode:Joi.string().optional(),
				phoneNumber:Joi.string().optional(),
				isConfirm:Joi.number().valid(0,1).optional(),
				address: Joi.array().items(Joi.object()).optional(),
				//Job required skill add 
				skillIds: Joi.array().items(Joi.object()).optional(),
				personalitiesIds: Joi.array().items(Joi.object()).optional(),
				emailsIds: Joi.array().items(Joi.object()).optional(),
				benefitsIds: Joi.array().items(Joi.object()).optional(),
				//Add question skills
				addScreeningQuestionIds: Joi.array().items(Joi.object()).optional(),
				//Add custom questions
				addCustomQuestion:Joi.array().items(Joi.object()).optional(),	
				jobEligibleForId:Joi.array().items(Joi.object()).optional(),	
				supplementalPayId:Joi.array().items(Joi.object()).optional(),
				subCategoryId:Joi.array().items(Joi.object()).optional(),	
			});
          
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			var objToSave = {};
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToSave.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "categoryId") && payloadData.categoryId != "") objToSave.categoryId = payload.categoryId;
			if (_.has(payloadData, "industryId") && payloadData.industryId != "") objToSave.industryId = payload.industryId;
			if (_.has(payloadData, "jobAssignedEachPlan") && payloadData.jobAssignedEachPlan != "") objToSave.jobAssignedEachPlan = payload.jobAssignedEachPlan;
			if (_.has(payloadData, "viewAssignedEachPlan") && payloadData.viewAssignedEachPlan != "") objToSave.viewAssignedEachPlan = payload.viewAssignedEachPlan;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "workPlaceLocation") && payloadData.workPlaceLocation != "") objToSave.workPlaceLocation = payload.workPlaceLocation; 
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "scheduleId") && payloadData.scheduleId != "") objToSave.scheduleId = payload.scheduleId;
			if (_.has(payloadData, "payOption") && payloadData.payOption != "") objToSave.payOption = payload.payOption;
			if (_.has(payloadData, "minimum") && payloadData.minimum != "") objToSave.minimum = payload.minimum;
			if (_.has(payloadData, "maximum") && payloadData.maximum != "") objToSave.maximum = payload.maximum;
			if (_.has(payloadData, "rate") && payloadData.rate != "") objToSave.rate = payload.rate;
			if (_.has(payloadData, "price") && payloadData.price != "") objToSave.price = payload.price;
			if (_.has(payloadData, "vaccinationCerificate") && payloadData.vaccinationCerificate != "") objToSave.vaccinationCerificate = payload.vaccinationCerificate;
			if (_.has(payloadData, "travelRequirementId") && payloadData.travelRequirementId != "") objToSave.travelRequirementId = payload.travelRequirementId;
			if (_.has(payloadData, "noOfPeopleRequired") && payloadData.noOfPeopleRequired != "") objToSave.noOfPeopleRequired = payload.noOfPeopleRequired;
			if (_.has(payloadData, "quicklyNeedForHireId") && payloadData.quicklyNeedForHireId != "") objToSave.quicklyNeedForHireId = payload.quicklyNeedForHireId;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "isConfirm")) objToSave.isConfirm = payload.isConfirm;
			objToSave.steps = 5;
			objToSave.recuiterId=payloadData.recuiterId;
			console.log("payload data",payloadData);
			//for delete the 
			
			console.log("this is id====>>",payload.id);
			let data={
				id:payload.id
			};	
			let criteriaForDelete={
				jobPostId:payload.id
			};
			console.log("Inside the loop");
			await Services.JobPostService.hardDelete(Models.JobPosts,data);
			await Services.JobPostService.hardDelete(Models.JobPostSubCategory,criteriaForDelete);
			await Services.JobPostService.hardDelete(Models.JobPostSkills,criteriaForDelete);
			await Services.JobPostService.hardDelete(Models.JobPostPersonalities,criteriaForDelete);
			await Services.JobPostService.hardDelete(Models.JobPostNotificationEmails,criteriaForDelete);
			await Services.JobPostService.hardDelete(Models.JobPostBenefits,criteriaForDelete);
			await Services.JobPostService.hardDelete(Models.JobPostAddQuestions,criteriaForDelete);	
		
			let objToFind={
				id:payload.recuiterId
			};
			let userType=await Services.RecruiterService.getUserType(objToFind,["id","userType","email"]);
			objToSave.userType=userType.dataValues.userType;
			if(userType.dataValues.userType==="SUB_RECRUITER"){
				let obj={
					email:userType.dataValues.email
				};
				let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
				objToSave.subRecuiterId=userId.dataValues.id;
			}
			
			var result={};
			if(payload.address&&payload.address.length>0){
				payload.address.forEach(async (addr) => {
					objToSave.location=addr.location;
					objToSave.state=addr.state;
					objToSave.city=addr.city;
					objToSave.latitude=addr.latitude;
					objToSave.longitude=addr.longitude;
					objToSave.zipCode=addr.zipCode;
					let addJob = await Services.JobPostService.saveData(objToSave);
					result.add=addJob;
					//Start of add detail of recruiter use plan detail and call the final function 

					// let subRecruiterCompanyId=null;
					// var isType=0;
					// if(userType.dataValues.userType==="SUB_RECRUITER"){
					// 	let obj={
					// 		email:userType.dataValues.email
					// 	};
					// 	let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
					// 	subRecruiterCompanyId=userId.dataValues.id;
					// 	isType=1;
					// }
					// let planId=await Services.JobPostService.getPlanIdFrpmRecruiterTransaction(payload.recuiterId);
					// console.log("planTIIIII========>",planId);
					// await recruiterUsePlan(payload.recuiterId,subRecruiterCompanyId,addJob.id,isType,planId.planId);
					
					//End
					if(addJob){
						if(payload.skillIds&& payload.skillIds.length>0){
							let skillPostArray=payload.skillIds.map(value => ({...value, jobPostId:addJob.id, recuiterId:payload.recuiterId}));
							result.addSkill = await Services.JobPostService.saveBulkCreate(Models.JobPostSkills,skillPostArray);	 
						}
						if(payload.personalitiesIds&&payload.personalitiesIds.length>0){
							let personalitiesArray=payload.personalitiesIds.map(value => ({...value, jobPostId:addJob.id}));
							result.addPersonalities = await Services.JobPostService.saveBulkCreate(Models.JobPostPersonalities,personalitiesArray);
						}
						if(payload.emailsIds&&payload.emailsIds.length>0){
							let emailNotification=payload.emailsIds.map(value => ({...value, jobPostId:addJob.id}));
							result.addemailsIds = await Services.JobPostService.saveBulkCreate(Models.JobPostNotificationEmails,emailNotification); 
						}
						if(payload.benefitsIds&&payload.benefitsIds.length>0){
							let benifit=payload.benefitsIds.map(value => ({...value, jobPostId:addJob.id}));
							result.addBenifits = await Services.JobPostService.saveBulkCreate(Models.JobPostBenefits,benifit);
						}
						if(payload.addCustomQuestion&&payload.addCustomQuestion.length>0){
							let objArray=payload.addCustomQuestion.map(value => ({...value, jobPostId:addJob.id,recuiterId:payload.recuiterId}));
							result.addCustomQuestion = await Services.JobPostService.saveBulkCreate(Models.JobPostAddQuestions,objArray);    
						}
						if(payload.jobEligibleForId&&payload.jobEligibleForId.length>0){
							let jobEligibleFor=payload.jobEligibleForId.map(value => ({...value, jobPostId:addJob.id}));
							result.JobPostEligibleFor = await Services.JobPostService.saveBulkCreate(Models.JobPostEligibleFor,jobEligibleFor);    
						}
						if(payload.supplementalPayId&&payload.supplementalPayId.length>0){
							let supplementalPayId=payload.supplementalPayId.map(value => ({...value, jobPostId:addJob.id}));
							result.supplementalPayId = await Services.JobPostService.saveBulkCreate(Models.JobPostSupplementPay,supplementalPayId);    
						}
						if(payload.subCategoryId&&payload.subCategoryId.length>0){
							let subCategory=payload.subCategoryId.map(value => ({...value, jobPostId:addJob.id}));
							result.subCategory = await Services.JobPostService.saveBulkCreate(Models.JobPostSubCategory,subCategory);    
						}
					}
				});
			}
			else{
				let addJob = await Services.JobPostService.saveData(objToSave);
				result.add=addJob;
				//Start of add detail of recruiter use plan detail and call the final function 

				// let subRecruiterCompanyId=null;
				// var isType=0;
				// if(userType.dataValues.userType==="SUB_RECRUITER"){
				// 	let obj={
				// 		email:userType.dataValues.email
				// 	};
				// 	let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
				// 	subRecruiterCompanyId=userId.dataValues.id;
				// 	isType=1;
				// }
				// let planId;
				// console.log("payload.recuiterId",payload.recuiterId);
				// planId=await Services.JobPostService.getPlanIdFrpmRecruiterTransaction(payload.recuiterId);
				// console.log("This is plan id========>",planId);
				// await recruiterUsePlan(payload.recuiterId,subRecruiterCompanyId,addJob.id,isType,planId.dataValues.planId);
				
				//End
				if(addJob){
					if(payload.skillIds&& payload.skillIds.length>0){
						let skillPostArray=payload.skillIds.map(value => ({...value, jobPostId:addJob.id, recuiterId:payload.recuiterId}));
						result.addSkill = await Services.JobPostService.saveBulkCreate(Models.JobPostSkills,skillPostArray);	 
					}
					if(payload.personalitiesIds&&payload.personalitiesIds.length>0){
						let personalitiesArray=payload.personalitiesIds.map(value => ({...value, jobPostId:addJob.id}));
						result.addPersonalities = await Services.JobPostService.saveBulkCreate(Models.JobPostPersonalities,personalitiesArray);  
					}
					if(payload.emailsIds&&payload.emailsIds.length>0){
						let emailNotification=payload.emailsIds.map(value => ({...value, jobPostId:addJob.id}));
						result.addemailsIds = await Services.JobPostService.saveBulkCreate(Models.JobPostNotificationEmails,emailNotification); 
					}
					if(payload.benefitsIds&&payload.benefitsIds.length>0){
						let benifit=payload.benefitsIds.map(value => ({...value, jobPostId:addJob.id}));
						result.addBenifits = await Services.JobPostService.saveBulkCreate(Models.JobPostBenefits,benifit);
					}
					if(payload.addCustomQuestion&&payload.addCustomQuestion.length>0){
						let objArray=payload.addCustomQuestion.map(value => ({...value, jobPostId:addJob.id,recuiterId:payload.recuiterId}));
						result.addCustomQuestion = await Services.JobPostService.saveBulkCreate(Models.JobPostAddQuestions,objArray);    
					}
					if(payload.jobEligibleForId&&payload.jobEligibleForId.length>0){
						let jobEligibleFor=payload.jobEligibleForId.map(value => ({...value, jobPostId:addJob.id}));
						result.JobPostEligibleFor = await Services.JobPostService.saveBulkCreate(Models.JobPostEligibleFor,jobEligibleFor);    
					}
					if(payload.supplementalPayId&&payload.supplementalPayId.length>0){
						let supplementalPayId=payload.supplementalPayId.map(value => ({...value, jobPostId:addJob.id}));
						result.supplementalPayId = await Services.JobPostService.saveBulkCreate(Models.JobPostSupplementPay,supplementalPayId);    
					}
					if(payload.subCategoryId&&payload.subCategoryId.length>0){
						let subCategory=payload.subCategoryId.map(value => ({...value, jobPostId:addJob.id}));
						result.subCategory = await Services.JobPostService.saveBulkCreate(Models.JobPostSubCategory,subCategory);    
					}
				}
			}
			if (result) {
				return {
					result:result,
					message:message.success.ADDED
				};
			}	  
		}catch (err){
			console.log(err);
			throw err;
		}	
	},
	getDetails: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				userId: Joi.string().required()
			});
			console.log(11, payloadData);
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				jobPostId: payload.id,
				isDeleted:0
			};
			let data={
				id:payload.id,
				isDeleted:0
			};
			var projectionJob=["id","isBlocked","isDeleted","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","location","state","city","zipCode","longitude","latitude","employementTypeId","scheduleId","payOption",
				"minimum","maximum","rate", "price","vaccinationCerificate","travelRequirementId",
				"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt","isConfirm","steps",
				[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
				[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
				[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "EmploymentTypesName"],
				[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
				[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
				[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' AND isDeleted=0 limit 1)`), "isApplyed"],
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"]
			];
			let JobPost = await Services.JobPostService.getSingleRecord(data,projectionJob);

			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved"
			];
			console.log(JobPost.recuiterId, "JobPost");
			let criteriaRecruiter = {
				id: JobPost.recuiterId
			};
			let result={};
			result.add = JobPost;
			result.addCustomQuestion = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId",
				[Sequelize.literal("(SELECT (screening_question.question) FROM screening_question as screening_question where job_post_add_questions.addScreeningQuestionId=screening_question.id )"), "screening_question_name"],
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_post_add_questions.recuiterId=recruiter.id )"), "recruiter_name"]]);
			result.addBenifits = await baseService.getAllRecordsWithoutCount(Models.JobPostBenefits,criteria,["id" , "benefitsId",
				[Sequelize.literal("(SELECT (benefits.name) FROM benefits as benefits where job_post_benefits.benefitsId=benefits.id limit 1)"), "benefitsName"]]);
			result.addemailsIds = await baseService.getAllRecordsWithoutCount(Models.JobPostNotificationEmails,criteria,["id","emailId"]);
			result.addPersonalities = await baseService.getAllRecordsWithoutCount(Models.JobPostPersonalities,criteria,["id","personalitiesId",
				[Sequelize.literal("(SELECT (personalities.name) FROM personalities as personalities where job_post_personalities.personalitiesId=personalities.id )"), "personalitiesName"]]);
			result.addSkill = await baseService.getAllRecordsWithoutCount(Models.JobPostSkills,criteria,["id","skillId",
				[Sequelize.literal("(SELECT (skills.name) FROM skills as skills where job_post_skills.skillId=skills.id)"), "skillsName"]]);
			result.addCustomQuestion = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId","recuiterId","title","experience","responseType","answer",
				[Sequelize.literal("(SELECT (screening_question.question) FROM screening_question as screening_question where job_post_add_questions.addScreeningQuestionId=screening_question.id )"), "screening_question_name"],
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_post_add_questions.recuiterId=recruiter.id )"), "recruiter_name"]]);
			result.address = await baseService.getAllRecordsWithoutCount(Models.JobPostAddress,criteria);	
			result.JobPostEligibleFor = await baseService.getAllRecordsWithoutCount(Models.JobPostEligibleFor,criteria,["id",
				[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_post_eligible_for.jobEligibleForId=eligibles.id )"), "eligibles_name"]]);	
			result.supplementalPayId = await baseService.getAllRecordsWithoutCount(Models.JobPostSupplementPay,criteria,["id",
				[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_post_supplement_pay.supplementalPayId=supplements.id )"), "supplements_name"]]);	
			result.subCategory = await baseService.getAllRecordsWithoutCount(Models.JobPostSubCategory,criteria,["id","categoryId","subCategoryId","others","jobPostId",
				[Sequelize.literal("(SELECT (sub_categories.name) FROM sub_categories as sub_categories where job_post_sub_category.subCategoryId=sub_categories.id )"), "subCategoryName"]]);		
			result.recruiter = await Services.RecruiterService.getDetail(criteriaRecruiter, projectionRecruiter);	
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	applicates: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				search: Joi.string().optional(),
				status:Joi.number().valid(0,1,2,3).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result={};
			result.count=await Services.JobPostService.getCount(payload);
			result.listing=await Services.JobPostService.getApplicant(payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	applicateStatusUpdate: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				recuiterId: Joi.string().optional(),
				note: Joi.string().optional(),
				status:Joi.number().valid(0,1,2,3,4).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id:payload.id
			};
			let objToFind={
				id:payload.recuiterId
			};
			let objToSave={};
			let userType=await Services.RecruiterService.getUserType(objToFind,["id","userType","email"]);
			objToSave.userType=userType.dataValues.userType;
			if(userType.dataValues.userType==="SUB_RECRUITER"){
				let obj={
					email:userType.dataValues.email
				};
				let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
				objToSave.subRecruiterId=userId.dataValues.id;
			}
			let getRecord=await Services.BaseService.getSingleRecord(Models.UserJobApply,criteria);
			if (_.has(payloadData, "status")) objToSave.status = payload.status;
			if (_.has(payloadData, "note")&&payloadData.note!== "") objToSave.note = payload.note;
			objToSave.jobPostId=getRecord.dataValues.jobPostId;
			objToSave.userId=getRecord.dataValues.userId;
			objToSave.recruiterId=payloadData.recuiterId;
			let objToSaved={};
			if (_.has(payloadData, "status")) objToSaved.status = payload.status;
			if (_.has(payloadData, "note")&&payloadData.note!== "") objToSaved.note = payload.note;
			await Services.JobPostService.addNoteStatusOnUserJobApply(criteria,objToSaved);
			let result={};
			result.status=await Services.JobPostService.addNoteStatus(objToSave);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	getResume: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().optional(),
				id: Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id", "name", "email", "bio","pronounsType", "customPronouns", "dateOfBirth", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified", "otherServiceTitle",
				"gender", "serviceDisabled","veteranRelationDocumentLink","scoreLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink","serviceId", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "lastVisit", "createdAt",
				[Sequelize.literal("(SELECT (services.name) FROM services as services where users.serviceId = services.id)"), "Services"],
				[Sequelize.literal(`(SELECT if(count(id)>0,1,0) FROM favouriter_candidate WHERE favouriter_candidate.userId='${payload.userId}'limit 1)`),  "isFavourite"]
			];
			let projection1=["id","jobPostId","userId",
				[Sequelize.literal(`(SELECT (job_posts.jobTitle) FROM job_posts as job_posts where job_posts.id = '${payload.id}')`), "jobTitle"]
			];
			let jobPojection=["id","isBlocked","isDeleted","createdAt","jobTitle","recuiterId","categoryId","industryId","description","workPlaceLocation","scheduleId","payOption",
				"minimum","maximum","rate", "price","jobEligibleForId","vaccinationCerificate","travelRequirementId","userType","subRecuiterId",
				"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber", "createdAt","isConfirm"];
			let result= {};
			result.listing=await Services.JobPostService.getApplicants(payload);
			result.job=await Services.JobPostService.getOne(payload,jobPojection);
			result.jobDetail=await Services.JobPostService.getApplicants(payload, projection1);
			result.user=await Services.UserBuildResumeService.getUser(payload,projection);
			result.status= await Services.UserBuildResumeService.getResumeStatus(payload);
			result.skills= await Services.UserBuildResumeService.getSkills(payload);
			result.educations= await Services.UserBuildResumeService.getEducation(payload);
			result.workExperiences= await Services.UserBuildResumeService.getWorkExperience(payload);
			result.volunteerExperiences= await Services.UserBuildResumeService.getVolunteerExperience(payload);
			result.projects= await Services.UserBuildResumeService.getProjectTaken(payload);
			result.awardsAndHonors= await Services.UserBuildResumeService.getAwardsAndHonors(payload);
			result.licenseAndCeritifcations= await Services.UserBuildResumeService.getLicenseAndCertification(payload);
			result.languages= await Services.UserBuildResumeService.getLanguage(payload);
			result.jobPreferences= await Services.UserBuildResumeService.getJobPreference(payload);
			result.userTourOfDuties= await Services.UserBuildResumeService.getUserTourOfDuties(payload);
			result.userScreeningQuestion= await Services.JobPostService.getUserScreeningQuestion(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	suggestedCanditate: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				search:Joi.string().optional(),
				recuiterId:Joi.string().optional(),
				jobPostId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result={};
			let projection=["id","name","email","location"];
			result.count=await Services.JobPostService.getCountSuggested(payload);
			result.listing=await Services.JobPostService.getSuggestedCandidate(payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	closeJob: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				id: Joi.string().required(),
				reason:Joi.string().optional(),
				recruiterId:Joi.string().optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
				isNotify:Joi.number().valid(0,1).optional()			
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id:payload.id
			};
			let objToUpdate={};
			if (_.has(payloadData, "isBlocked")) objToUpdate.isBlocked = payload.isBlocked;
			if (_.has(payloadData, "reason")&& payloadData.reason != "") objToUpdate.reason = payload.reason;
			objToUpdate.jobClosingTime=new Date();
			let objToFind={
				id:payload.recruiterId
			};
			let userType=await Services.RecruiterService.getUserType(objToFind,["id","userType","email"]);
			objToUpdate.userType=userType.dataValues.userType;
			if(userType.dataValues.userType==="SUB_RECRUITER"){
				let obj={
					email:userType.dataValues.email
				};
				let userId=await Services.RecruiterUserService.getRecruiterUsers(obj,["id"]);
				objToUpdate.subRecruiterId=userId.dataValues.id;
			}
			let result={};
			result.status=await Services.JobPostService.updateData(criteria,objToUpdate);
			if(payload.isNotify&&payload.isNotify===1){
				let userDetail=await Services.JobPostService.getAllUserDetail(criteria,["jobPostId","userId"]);
				Promise.all(userDetail.map(async (id)=>{
					let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: id.dataValues.userId}, ["deviceToken", "deviceType" ], 50, 0);
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
						userId: id.dataValues.userId,
						title:"Job closed",
						message: "Job "+payload.id+" has been closed by the recruiter",
						notificationType:12,
						userType: 0,
						deviceType: 0,
						recruiterId:payloadData.recruiterId,
						jobId:payload.id
					};
					var dataNotification ={
						title:"Job closed",
						message: "Job "+payload.id+" has been closed by the recruiter",
						notificationType:"12",
						flag:"1",
						notificationId : "1",
						jobId:payload.id,
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
			}
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	suggestedCanditateShortListed: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				jobPostId:Joi.string().required(),
				status: Joi.number().valid(0,1,2,3,4).optional(),			
				flag: Joi.number().valid(0, 1).optional(),			
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId")&& payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "jobPostId")&& payloadData.jobPostId != "") objToSave.jobPostId = payload.jobPostId;
			objToSave.status=1;
			objToSave.flag=1;
			let result={};
			result.status=await Services.UserJobService.saveData(objToSave);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	suggestedCanditateHide: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				jobPostId:Joi.string().optional(),
				recuiterId:Joi.string().optional()		
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			console.log("Payload=====>",payload);
			console.log("payloadData=====>",payloadData);
			if (_.has(payloadData, "userId")&& payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "jobPostId")&& payloadData.jobPostId != "") objToSave.jobPostId = payload.jobPostId;
			objToSave.recruiterId=payloadData.recuiterId;
			let objToActionSave={};
			if (_.has(payloadData, "userId")&& payloadData.userId != "") objToActionSave.userId = payload.userId;
			objToActionSave.recuiterId=payloadData.recuiterId;
			objToActionSave.actionType=4;
			await Services.FavouriteAndSkippedService.saveRecruiterView(objToActionSave);
			let criteria={
				userId:payload.userId,
				// jobPostId:payload.jobPostId,
				recruiterId:payload.recuiterId
			};
			let alreadyExist= await Services.BaseService.getSingleRecord(Models.SuggestedHide,criteria);
			if(alreadyExist){
				await Services.JobPostService.hardDelete(Models.SuggestedHide,criteria);
			}
			let result={};
			if(!alreadyExist){
				console.log("objToSave----->",objToSave);
				result.status=await Services.JobPostService.saveHide(objToSave);
			}
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	getUserAllNotes: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				filter:Joi.number().optional(),
				recruiterId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection=["id","createdAt","updatedAt","name","isBlocked","isDeleted","email","bio","countryCode","phoneNumber","isPhoneVerified","gender","location","militaryJobTitle",
				"pronounsType","profileImage","veteranRelationName","veteranRelationDocumentLink","zipCode","latitude","longitude","dateOfBirth","lastVisit","platformType"];
			let result= {};
			let projection1=["id","isBlocked","updatedAt","createdAt","userId","jobPostId","status","note","recruiterId",
				[Sequelize.literal("(SELECT (users.name) FROM users as users where user_job_notes.userId=users.id)"), "userName"],	
				[Sequelize.literal("(SELECT (job_posts.jobTitle) FROM job_posts as job_posts where user_job_notes.jobPostId=job_posts.id)"), "jobTitle"]   
			];
			result.user=await Services.UserBuildResumeService.getUser(payload,projection);
			result.educations= await Services.UserBuildResumeService.getEducation(payload);
			result.allNotes=await Services.JobPostService.getAllNoteRecord(payload,projection1, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateUserNotes: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id:Joi.string().required(),
				userId: Joi.string().optional(),
				recuiterId: Joi.string().optional(),
				note: Joi.string().optional(),
				isDeleted:Joi.number().valid(0,1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id:payload.id
			};
			let objToUpdate={};
			if (_.has(payloadData, "userId")&&payloadData.userId!== "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "note")&&payloadData.note!== "") objToUpdate.note = payload.note;
			if (_.has(payloadData, "isDeleted")) objToUpdate.isDeleted = payloadData.isDeleted;
			objToUpdate.recruiterId=payloadData.recuiterId;
			let result= {};
			if(!payloadData.isDeleted){
				await Services.JobPostService.addNoteStatusOnUserJobApply(criteria,objToUpdate);
			}
			if(payloadData.isDeleted){
				let updateNote={};
				let c={
					userId:payload.userId
				};
				updateNote.note = "";
				await Services.JobPostService.addNoteStatusOnUserJobApply(c,updateNote);
			}
			console.log("criteria==>",criteria);
			console.log("objToUpdate==>",objToUpdate);
			result.status=await Services.JobPostService.UpdateNoteStatus(criteria,objToUpdate);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	activityPerformByAllRecruiterOnCandidate: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),	
				recruiterId: Joi.string().required(),	
				filter: Joi.number().optional(),
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				// filter:Joi.number().optional(),	
				// recruiterId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection=["id","createdAt","updatedAt","isBlocked","recuiterId","userId","actionType","note",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter_view.recuiterId=recruiter.id)"), "recruiterName"],	
				[Sequelize.literal("(SELECT (users.name) FROM users as users where recruiter_view.userId=users.id)"), "userName"],	
				[Sequelize.literal("(SELECT (users.email) FROM users as users where recruiter_view.userId=users.id)"), "userEmail"],	    
			];
			let result={};
			result.listing=await Services.JobPostService.activityPerformByAllRecruiterOnCandidate(payload,projection,parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},
	activeJobsLists: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				recruiterId: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId","travelRequirementId","scheduleId","workPlaceLocation","location","state","city","zipCode","longitude","latitude", "payOption", "location","price","maximum", "minimum", "noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt","isConfirm","isBlocked","isDeleted","steps",
				[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "recruiterName"],	
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id AND isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' AND isDeleted=0  limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT count(id) FROM job_post_notification_emails where jobPostId=job_posts.id  limit 1)"), "suggestedCandidateCount"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal("(SELECT CONCAT('JOB', RIGHT(id, 7)) AS new_id ORDER BY new_id ASC)"),"newId"],
			];
			let criteria = {
				isDeleted: 0,
				isBlocked: 0,
				isConfirm: 1,
				recruiterId:payload.recruiterId
			};
			let result= {};
			// result.count=await Services.JobPostService.count(criteria);
			result.listing = await Services.JobPostService.getActiveJobsListing(
				criteria, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
           
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}
	},
};

let recruiterUsePlan=async(recuiterId,subRecruiterCompanyId,jobId,isType,planId)=>{
	console.log(recuiterId,subRecruiterCompanyId,jobId,isType,planId);
	let objToSave={};
	objToSave.companyId=recuiterId;
	objToSave.subRecruiterId=subRecruiterCompanyId;
	objToSave.jobId=jobId;
	objToSave.isType=isType;
	objToSave.planId=planId;
	await Services.BaseService.saveData(Models.RecruiterUsePlan,objToSave);
};