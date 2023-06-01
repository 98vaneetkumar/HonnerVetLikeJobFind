const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const Services = require("../../services");
const message = require("../../config/messages");
const Model=require("../../models");
const Sequelize = require("sequelize");
module.exports = {
	filterUser: async (payloadData) => {
		try {
			//left with category,work-authorization,company/Employer,distance
			const schema = Joi.object().keys({
				limit: Joi.number().optional(), //done 
				skip: Joi.number().optional(), //done 
				// search: Joi.string().optional().allow(""), //done 
				search:Joi.array().items().optional(),
				location: Joi.string().optional().allow(""), //done 
				willingToRelocate: Joi.number().optional(), //done
				salary: Joi.number().optional(), //done
				skillId: Joi.array().items().optional().allow(""), //done
				industryId: Joi.array().items().optional().allow(""), //done
				workExperiences: Joi.number().optional(), //done
				// companyName: Joi.array().items().optional().allow(""),
				jobTitleId: Joi.array().items().optional().allow(""), //done
				jobPreferenceId: Joi.array().items().optional().allow(""), //done
				vaternStatus:  Joi.array().items().optional().allow(""), //done
				language: Joi.array().items().optional().allow(""), //done
				specializationId: Joi.array().items().optional().allow(""), //done
				travelRequirementId: Joi.array().items().optional().allow(""), //done
				workPlace: Joi.array().items().optional().allow(""), //done
				securityClearanceId: Joi.array().items().optional().allow(""), //done
				employementTypeId: Joi.array().items().optional().allow(""), //done
				availability: Joi.number().valid(0,1).optional(), //done
				personalityTest: Joi.array().items().optional().allow(""), //done
				resumeLastUpdate:Joi.number().optional(),//done for last 3 months only missing in 
				excludeCandidate:Joi.array().items().optional(),//done left with forwarded ==> 0 for view 2 for email 3 form add to list(Favourite)
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result = {};
			let projection=["id","createdAt","updatedAt","name","email","bio","countryCode","phoneNumber","gender","serviceDisabled","facebookId","googleId",
				"appleId","personalityTest","militaryJobTitle","location","linkedInLink","scoreLink","pronounsType","customPronouns","profileImage","veteranRelationName","veteranRelationType",
				"authenticityDocumentLink","veteranRelationDocumentLink","zipCode","latitude","longitude","dateOfBirth","lastVisit","serviceId","otherServiceTitle","downloadUrl","platformType","loginType","userType","notificationStatus","isTermsAndConditionsAccepted",
				[Sequelize.literal("(SELECT if(count(id)>0,1,0) FROM favouriter_candidate WHERE favouriter_candidate.userId=users.id limit 1)"),  "isFavourite"]];
			result.count= await Services.RecruiterSearchService.count(payload);
			result.user = await Services.RecruiterSearchService.getUserListing(
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
	saveSearch: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				search:Joi.array().items().optional(),
				recuiterId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={
				title:payload.search.toString(),
				recuiterId:payload.recuiterId
			};
			await Services.BaseService.saveData(Model.RecruiterSearchKey,objToSave);
			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getSearch:async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				limit: Joi.number().optional(), 
				skip: Joi.number().optional(),
				recuiterId:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection=["id","recuiterId","title","createdAt","updatedAt"];
			let result={};
			result.count=await Services.RecruiterSearchService.countSaveSearch(payload);
			result.data = await Services.RecruiterSearchService.getSearch(payload,projection, 
				parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteSearch:async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id:Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id:payload.id
			};
			await Services.BaseService.delete(Model.RecruiterSearchKey,criteria);
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getListSubCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			categoryId: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.count= 	await Services.RecruiterSearchService.countSubCategories(payload);
		result.data = await Services.RecruiterSearchService.getListingSubCategories(payload);
		return result;
	},
	getListCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		let projection=["id","name","isBlocked","createdAt"];
		result.count= 	await Services.RecruiterSearchService.countCategories(payload);
		result.data = await Services.RecruiterSearchService.getCategories(payload,projection);
		return result;
	},
	allCommanRecruiteSideSearch: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			console.log(payloadData);
			let result= {};
			result.workPlace = [{"id": "Remote", "name":"Remote"}, {"id": "On-site", "name":"On-site"}, {"id": "Hybrid", "name":"Hybrid"}];
			result.vaternStatus = [{"id": 0, "name":"Veteran"}, {"id": 1, "name":"Veteran spouse"}, {"id": 2, "name":"Veteran family member"}];
			result.category = await Services.RecruiterSearchService.getCategories(payload,["id","name","isBlocked","createdAt"]);
			result.industry = await Services.IndustriesService.getAllListing({});
			result.jobtitle = await Services.JobTitleService.getAllListing({});
			result.skills = await Services.SkillsService.getListingCommanSkill({});
			result.employmentTypes = await Services.EmploymentTypeService.getListing(
				payload, parseInt(payload.limit, 10) || 1000, parseInt(payload.skip, 10) || 0);
			result.specializationsOrEducation = await Services.SpecializationService.getListing(
				payload, parseInt(payload.limit, 10) || 1000, parseInt(payload.skip, 10) || 0);	
			result.travelRequirement = await Services.TravelRequirementsService.getListing(
				payload,
				parseInt(payload.limit, 10) || 1000,
				parseInt(payload.skip, 10) || 0
			);	
			result.securityClearance = await Services.SecurityClearanceService.getListing(
				payload, parseInt(payload.limit, 10) || 1000, parseInt(payload.skip, 10) || 0
			);	
			result.personality = await Services.PersonalitiesService.getListing(
				payload, parseInt(payload.limit, 10) || 1000, parseInt(payload.skip, 10) || 0
			);	
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
};
