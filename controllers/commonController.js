const Joi = require("joi");
let commonHelper = require("../helpers/common");
let Services = require("../services");
const Models = require("../models");
module.exports = {
	getSkills: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.SkillsService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.SkillsService.count(payload);
		return result;
	},
	getServices: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.ServiceService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.ServiceService.count(payload);
		return result;
	},
	getEmploymentTypes: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.EmploymentTypeService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.EmploymentTypeService.count(payload);
		return result;
	},
	getSpecializations: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.SpecializationService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.SpecializationService.count(payload);
		return result;
	},
	getUniversities: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.UniversityService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.UniversityService.count(payload);
		return result;
	},
	travelRequirements: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.TravelRequirementsService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.TravelRequirementsService.count(payload);
		return result;
	},
	securityClearance: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.listing = await Services.SecurityClearanceService.getListing(
			payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.SecurityClearanceService.count(payload);
		return result;
	},
	allUniversitiesAndSpecializations: async(payloadData) => {
		try{
			console.log(payloadData);
			let result= {};
			result.universities = await Services.UniversityService.getAllListing({});
			result.specialization = await Services.SpecializationService.getAllListing({});
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	allIndustryAndJobTitle: async(payloadData) => {
		try{
			console.log(payloadData);
			let result= {};
			result.industry = await Services.IndustriesService.getAllListing({});
			result.jobtitle = await Services.JobTitleService.getAllListing({});
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	getSkillsAndSuggestSkill: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let skills =await Services.SkillsService.getAllSearchListing(payload);
			// let suggestSkills =await Services.SuggestSkillsService.getAllSearchListing(payload);
			let result= {
				skills : skills,	
			};
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	getJobTitlesAndSuggestJobTitle: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let jobTitle =await Services.SkillsService.getAllSearchListingOfJobTitle(payload);
			// let suggestSkills =await Services.SuggestSkillsService.getAllSearchListing(payload);
			let result= {
				jobTitle : jobTitle,	
			};
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	getAllsecurityClearanceAndtravelRequirements: async(payloadData) => {
		try{
			console.log(payloadData);
			let result= {};
			result.securityClearance = await Services.SecurityClearanceService.getAllListing({});
			result.travel = await Services.TravelRequirementsService.getAllListing({});
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	getCommanAll: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
			let workPlace = [{"id": "Remote", "name":"Remote"}, {"id": "On-site", "name":"On-site"}, {"id": "Hybrid", "name":"Hybrid"}];
			result.skills = await Services.SkillsService.getListing(
				payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
			result.services = await Services.ServiceService.getListing(
				payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);
			result.employmentTypes = await Services.EmploymentTypeService.getListing(
				payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);	
			result.specializations = await Services.SpecializationService.getListing(
				payload, parseInt(payload.limit, 10) || 100, parseInt(payload.skip, 10) || 0);	
			result.industry = await Services.IndustriesService.getAllListing({});	
			result.benefits = await Services.BenefitsService.getListing(
				payload,
				parseInt(payload.limit, 10) || 10,
				parseInt(payload.skip, 10) || 0	  );
			result.personalities = await Services.PersonalitiesService.getListing(
				payload,
				parseInt(payload.limit, 10) || 10,
				parseInt(payload.skip, 10) || 0
			);	
			result.categories = await Services.CategoriesService.getListingCategories(
				payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.securityClearance = await Services.SecurityClearanceService.getAllListing({});
			result.travel = await Services.TravelRequirementsService.getAllListing({});
			result.workPlace = workPlace;
			result.eligible = await Services.EligibleService.getListing({}, 10,0);
			
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	downloadResumeSample: async(payloadData) => {
		try{
			console.log(payloadData);
			let result= {};
			let criteria = {
				isDeleted:0,
				isBlocked:0
			};
			let projection = ["id", "name", "images", "templateId"];
			result.listing = await Services.BaseService.getAllRecordsWithModels(Models.ResumeSample, criteria, projection, true);
			return result;
		}catch (err){
			console.log(err);
			throw err;	
		}
	},
	test: async (payloadData) => { 
		const pushToSecondarySQS = require("../helpers/pushToSecondarySQS");
		const config = require("./../config/appConstants");
		if (!payloadData) {
			payloadData = {
				data:"payload parameters"
			};
		}
		await  pushToSecondarySQS.sendMessage(config.APP_CONSTANTS.SECONDARY_ACTIONS.TEST, "test", payloadData);
	}
};