
const Joi = require("joi");
let commonHelper = require("../../helpers/common");

let Services = require("../../services");
const Models = require("../../models");
const baseService =require("../../services/base");
const Sequelize = require("sequelize");
var projection=["id","isBlocked","isDeleted","createdAt","jobTitle","recuiterId","travelRequirementId","jobEligibleForId","scheduleId","workPlaceLocation","categoryId","industryId","description","location","employementTypeId","scheduleId","payOption",
	"minimum","maximum","rate","supplementalPayId","jobEligibleForId","vaccinationCerificate","travelRequirementId",
	"noOfPeopleRequired","quicklyNeedForHireId","countryCode","phoneNumber",
	[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where recruiter.id=job_posts.recuiterId )"), "Recruiter_Name"],
	[Sequelize.literal("(SELECT (recruiter.email) FROM recruiter as recruiter where job_posts.recuiterId=recruiter.id)"), "Recruiter_Email"],
	[Sequelize.literal("(SELECT (categories.name) FROM categories as categories where job_posts.categoryId=categories.id)"), "categoryName"],
	[Sequelize.literal("(SELECT (industries.name) FROM industries as industries where job_posts.industryId=industries.id)"), "industriesName"],
	[Sequelize.literal("(SELECT (employement_types.name) FROM employement_types as employement_types where job_posts.employementTypeId=employement_types.id )"), "EmploymentTypesName"],
	[Sequelize.literal("(SELECT (schedules.name) FROM schedules as schedules  where job_posts.scheduleId=schedules.id)"), "schedulesName"],
	[Sequelize.literal("(SELECT (supplements.name) FROM supplements as supplements where job_posts.supplementalPayId= supplements.id)"), "supplementsName"],
	[Sequelize.literal("(SELECT (eligibles.name) FROM eligibles as eligibles where job_posts.jobEligibleForId=eligibles.id )"), "eligiblesName"],
	[Sequelize.literal("(SELECT (travel_requirements.name) FROM travel_requirements as travel_requirements where job_posts.travelRequirementId=travel_requirements.id )"), "travelRequirementsName"],
	[Sequelize.literal("(SELECT (hires.name) FROM hires as hires where job_posts.quicklyNeedForHireId=hires.id )"), "Hiresrequired"]
];
module.exports = {
	getList: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				recuiterId: Joi.string().guid({ version: "uuidv4" }).required(),
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
				travelRequirementId:Joi.array().optional(),
				personalitiesIds: Joi.array().optional(),
				scheduleId:Joi.array().optional(),
				workPlaceLocation:Joi.array().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			console.log("payload===>",payload);
			let result= {};
			result.count=await Services.AdminJobsPostedService.count(payload);
			result.data = await Services.AdminJobsPostedService.getListing(
				payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
           
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
			let result={};
			result.JobPost = await baseService.getSingleRecord(Models.JobPosts,data,projection);
			result.JobPostAddQuestions = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId",[Sequelize.literal("(SELECT (screening_question.title) FROM screening_question as screening_question where job_post_add_questions.addScreeningQuestionId=screening_question.id )"), "screening_question_name"],[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_post_add_questions.recuiterId=recruiter.id )"), "recruiter_name"]]);
			result.JobPostBenefits = await baseService.getAllRecordsWithoutCount(Models.JobPostBenefits,criteria,["id" , "benefitsId",[Sequelize.literal("(SELECT (benefits.name) FROM benefits as benefits where job_post_benefits.benefitsId=benefits.id limit 1)"), "benefitsName"]]);
			result.JobPostNotificationEmails = await baseService.getAllRecordsWithoutCount(Models.JobPostNotificationEmails,criteria,["id","emailId"]);
			result.JobPostPersonalities = await baseService.getAllRecordsWithoutCount(Models.JobPostPersonalities,criteria,["id","personalitiesId",[Sequelize.literal("(SELECT (personalities.name) FROM personalities as personalities where job_post_personalities.personalitiesId=personalities.id )"), "personalitiesName"]]);
			result.JobPostSkills = await baseService.getAllRecordsWithoutCount(Models.JobPostSkills,criteria,["id","skillId",[Sequelize.literal("(SELECT (skills.name) FROM skills as skills where job_post_skills.skillId=skills.id)"), "skillsName"]]);
			result.JobPostAddQuestions = await baseService.getAllRecordsWithoutCount(Models.JobPostAddQuestions,criteria,["id","addScreeningQuestionId","recuiterId","title","experience","responseType","answer",[Sequelize.literal("(SELECT (recruiter.name) FROM recruiter as recruiter where job_post_add_questions.recuiterId=recruiter.id )"), "recruiter_name"]]);
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
		
	},

};