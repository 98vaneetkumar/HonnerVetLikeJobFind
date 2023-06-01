const _ = require("underscore");
const Joi = require("joi");
const Models = require("../../models");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const Services = require("../../services");
const Sequelize = require("sequelize");
const moment = require("moment");
const NotificationManager = require("../../helpers/notificationManager");
module.exports = {

	getResume: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			console.log(payloadData,"dasffffffffffffffffffffffffffff");
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= {};
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
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// skills module start
	getSkills: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getSkills(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	addUpdateSkills: async(payloadData) => {
		const schema = Joi.object().keys({
			userId: Joi.string().required(),   
			skillIdsArray : Joi.array().optional().items(Joi.object().keys({
				skillId: Joi.string().required()
			})),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let skillIdsArray = payload.skillIdsArray;

		if(skillIdsArray && skillIdsArray.length > 0)
		{
			let arrSkills = skillIdsArray.map(value => ({...value, userId: payload.userId}));
			let criteria={
				userId: payload.userId
			};
			await Services.UserBuildResumeService.deleteRecords(Models.UserSkills,criteria);

			await Services.UserBuildResumeService.saveUserBulkEntriesForSkills(arrSkills);
			
			let checkResumeStatus= await Services.UserBuildResumeService.getResumeStatus(payload);

			console.log(checkResumeStatus, "checkResumeStatus");
			let checkResumeStatus1= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			console.log(checkResumeStatus1);
		
			await lastUpdateStep(payload, {isSkills : 1, isSteped:4});

			if(checkResumeStatus && checkResumeStatus.length > 0)
			{	
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isSkills : 1});
				
			}
			else
			{	
				
				await Services.UserBuildResumeService.saveResumeStatus({userId: payload.userId, isSkills : 1});
				
			}
		}
		return message.success.UPDATED;
	},
	// skills module end
	addUpdateSkillsV1: async(payloadData) => {
		const schema = Joi.object().keys({
			userId: Joi.string().required(),   
			skillIdsArray : Joi.array().optional().items(Joi.object().keys({
				skillId: Joi.string().required(),
				otherTitle: Joi.string().optional()
			})),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let skillIdsArray = payload.skillIdsArray;

		if(skillIdsArray && skillIdsArray.length > 0)
		{
			let arrSkills = skillIdsArray.map(value => ({...value, userId: payload.userId}));
			let criteria={
				userId: payload.userId
			};
			await Services.UserBuildResumeService.deleteRecords(Models.UserSkills,criteria);

			await Services.UserBuildResumeService.saveUserBulkEntriesForSkills(arrSkills);
			
			let checkResumeStatus= await Services.UserBuildResumeService.getResumeStatus(payload);

			console.log(checkResumeStatus, "checkResumeStatus");
			let checkResumeStatus1= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			console.log(checkResumeStatus1);
			await lastUpdateStep(payload, {isSkills : 1, isSteped:4});
			if (checkResumeStatus1.isSkills ===1) {
				await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",2);
			}
			if(checkResumeStatus && checkResumeStatus.length > 0)
			{	
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isSkills : 1});
			}
			else
			{	
				await Services.UserBuildResumeService.saveResumeStatus({userId: payload.userId, isSkills : 1});
			}
		}
		return message.success.UPDATED;
	},
	// education module start
	getEducation: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getEducation(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	addEducation: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				universityId: Joi.string().optional(), 
				specializationId:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				gpa: Joi.string().optional(), 
				description: Joi.string().optional(), 
				isPursuing: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "universityId") && payloadData.universityId != "") objToSave.universityId = payload.universityId;
			if (_.has(payloadData, "specializationId") && payloadData.specializationId != "") objToSave.specializationId = payload.specializationId;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToSave.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToSave.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "gpa") && payloadData.gpa != "") objToSave.gpa = payload.gpa;
			if (_.has(payloadData, "isPursuing") && payloadData.isPursuing != "") objToSave.isPursuing = payload.isPursuing;
			await Services.UserBuildResumeService.saveEducation(objToSave);
			await lastUpdateStep(payload, {isEducation : 1, isSteped:5});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isEducation : 1});
			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	addEducationV1: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				universityId: Joi.string().optional(), 
				specializationId:  Joi.string().optional(), 
				otherTitleUniveristy:  Joi.string().optional(), 
				otherTitleSpecialization:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				gpa: Joi.string().optional(), 
				description: Joi.string().optional(), 
				isPursuing: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "universityId") && payloadData.universityId != "") objToSave.universityId = payload.universityId;
			if (_.has(payloadData, "specializationId") && payloadData.specializationId != "") objToSave.specializationId = payload.specializationId;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToSave.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToSave.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "gpa") && payloadData.gpa != "") objToSave.gpa = payload.gpa;
			if (_.has(payloadData, "isPursuing") && payloadData.isPursuing != "") objToSave.isPursuing = payload.isPursuing;
			if (_.has(payloadData, "otherTitleUniveristy") && payloadData.otherTitleUniveristy != "") objToSave.otherTitleUniveristy = payload.otherTitleUniveristy;
			if (_.has(payloadData, "otherTitleSpecialization") && payloadData.otherTitleSpecialization != "") objToSave.otherTitleSpecialization = payload.otherTitleSpecialization;
			await Services.UserBuildResumeService.saveEducation(objToSave);
			await lastUpdateStep(payload, {isEducation : 1, isSteped:5});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isEducation : 1});
			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateEducation: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				universityId: Joi.string().optional(), 
				specializationId:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				gpa: Joi.string().optional(), 
				description: Joi.string().optional(), 
				isPursuing: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				fromDate:null,
				toDate:null,
				gpa:"",
				description:"",
				isPursuing:0,
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "universityId") && payloadData.universityId != "") objToUpdate.universityId = payload.universityId;
			if (_.has(payloadData, "specializationId") && payloadData.specializationId != "") objToUpdate.specializationId = payload.specializationId;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToUpdate.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToUpdate.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "gpa") && payloadData.gpa != "") objToUpdate.gpa = payload.gpa;
			if (_.has(payloadData, "isPursuing") ) objToUpdate.isPursuing = payload.isPursuing;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateEducation(criteria,objToUpdate);
			await lastUpdateStep(payload, {isEducation : 1, isSteped:5});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isEducation : 1});
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateEducationV1: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				universityId: Joi.string().optional(), 
				specializationId:  Joi.string().optional(),
				otherTitleUniveristy:  Joi.string().optional(), 
				otherTitleSpecialization:  Joi.string().optional(),  
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				gpa: Joi.string().optional(), 
				description: Joi.string().optional(), 
				isPursuing: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				fromDate:null,
				toDate:null,
				gpa:"",
				description:"",
				isPursuing:0,
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "universityId") && payloadData.universityId != "") objToUpdate.universityId = payload.universityId;
			if (_.has(payloadData, "specializationId") && payloadData.specializationId != "") objToUpdate.specializationId = payload.specializationId;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToUpdate.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToUpdate.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "gpa") && payloadData.gpa != "") objToUpdate.gpa = payload.gpa;
			if (_.has(payloadData, "isPursuing") ) objToUpdate.isPursuing = payload.isPursuing;
			if (_.has(payloadData, "otherTitleUniveristy") && payloadData.otherTitleUniveristy != "") objToUpdate.otherTitleUniveristy = payload.otherTitleUniveristy;
			if (_.has(payloadData, "otherTitleSpecialization") && payloadData.otherTitleSpecialization != "") objToUpdate.otherTitleSpecialization = payload.otherTitleSpecialization;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateEducation(criteria,objToUpdate);
			await lastUpdateStep(payload, {isEducation : 1, isSteped:5});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isEducation : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",3);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteEducation: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateEducation(criteria,objToUpdate);
			let result= await Services.UserBuildResumeService.getEducation(payload);
			if(result.length === 0){
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isEducation : 0});
			}
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// education module end

	// work experience module start
	getWorkExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getWorkExperience(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	addWorkExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				jobTitle: Joi.string().optional(), 
				companyName:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				employementTypeId: Joi.string().optional(), 
				description: Joi.string().optional(), 
				underContractOf: Joi.string().optional(), 
				location: Joi.string().optional(), 
				zipCode: Joi.string().optional(), 
				latitude: Joi.string().optional(), 
				longitude: Joi.string().optional(), 
				isCurrentlyRole: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToSave.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "companyName") && payloadData.companyName != "") objToSave.companyName = payload.companyName;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToSave.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToSave.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "underContractOf") && payloadData.underContractOf != "") objToSave.underContractOf = payload.underContractOf;
			if (_.has(payloadData, "location") && payloadData.location != "") objToSave.location = payload.location;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToSave.zipCode = payload.zipCode;
			if (_.has(payloadData, "latitude") && payloadData.latitude != "") objToSave.latitude = payload.latitude;
			if (_.has(payloadData, "longitude") && payloadData.longitude != "") objToSave.longitude = payload.longitude;
			if (_.has(payloadData, "isCurrentlyRole") && payloadData.isCurrentlyRole != "") objToSave.isCurrentlyRole = payload.isCurrentlyRole;

			await Services.UserBuildResumeService.saveWorkExperience(objToSave);
			await lastUpdateStep(payload, {isWorkExperiences : 1, isSteped: 6});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isWorkExperiences : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateWorkExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				jobTitle: Joi.string().optional(), 
				companyName:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				employementTypeId: Joi.string().optional(), 
				description: Joi.string().optional(), 
				underContractOf: Joi.string().optional(), 
				location: Joi.string().optional(), 
				zipCode: Joi.string().optional(), 
				latitude: Joi.string().optional(), 
				longitude: Joi.string().optional(), 
				isCurrentlyRole: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				jobTitle: null,
				companyName: null,
				fromDate: null,
				toDate: null,
				description: null,
				location: null,
				underContractOf: null,
				zipCode: null,
				latitude: null,
				longitude: null
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToUpdate.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToUpdate.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "companyName") && payloadData.companyName != "") objToUpdate.companyName = payload.companyName;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToUpdate.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToUpdate.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "underContractOf") && payloadData.underContractOf != "") objToUpdate.underContractOf = payload.underContractOf;
			if (_.has(payloadData, "location") && payloadData.location != "") objToUpdate.location = payload.location;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			if (_.has(payloadData, "latitude") && payloadData.latitude != "") objToUpdate.latitude = payload.latitude;
			if (_.has(payloadData, "longitude") && payloadData.longitude != "") objToUpdate.longitude = payload.longitude;
			if (_.has(payloadData, "isCurrentlyRole") ) objToUpdate.isCurrentlyRole = payload.isCurrentlyRole;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateWorkExperience(criteria,objToUpdate);
			await lastUpdateStep(payload, {isWorkExperiences : 1, isSteped: 6});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isWorkExperiences : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",4);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteWorkExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateWorkExperience(criteria,objToUpdate);
			let result= await Services.UserBuildResumeService.getWorkExperience(payload);
			if (result.length ===0) {
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isWorkExperiences : 0});
			}
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// work experience module end

	// volunteer experience module start
	getVolunteerExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getVolunteerExperience(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	addVolunteerExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				organization: Joi.string().optional(), 
				role:  Joi.string().optional(), 
				cause:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				employementTypeId: Joi.string().optional(), 
				description: Joi.string().optional(), 
				isCurrentlyRole: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "organization") && payloadData.organization != "") objToSave.organization = payload.organization;
			if (_.has(payloadData, "role") && payloadData.role != "") objToSave.role = payload.role;
			if (_.has(payloadData, "cause") && payloadData.cause != "") objToSave.cause = payload.cause;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToSave.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToSave.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "isCurrentlyRole") && payloadData.isCurrentlyRole != "") objToSave.isCurrentlyRole = payload.isCurrentlyRole;

			await Services.UserBuildResumeService.saveVolunteerExperience(objToSave);
			await lastUpdateStep(payload, {isVolunteerExperiences : 1, isSteped:7});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isVolunteerExperiences : 1});
			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateVolunteerExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				organization: Joi.string().optional(), 
				role:  Joi.string().optional(), 
				cause:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				employementTypeId: Joi.string().optional(), 
				description: Joi.string().optional(), 
				isCurrentlyRole: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				fromDate:null,
				toDate:null,
				organization:null,
				role:null,
				cause:null,
				description:null
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToUpdate.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "organization") && payloadData.organization != "") objToUpdate.organization = payload.organization;
			if (_.has(payloadData, "role") && payloadData.role != "") objToUpdate.role = payload.role;
			if (_.has(payloadData, "cause") && payloadData.cause != "") objToUpdate.cause = payload.cause;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToUpdate.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToUpdate.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "isCurrentlyRole") ) objToUpdate.isCurrentlyRole = payload.isCurrentlyRole;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateVolunteerExperience(criteria,objToUpdate);
			await lastUpdateStep(payload, {isVolunteerExperiences : 1, isSteped:7});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isVolunteerExperiences : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",5);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteVolunteerExperience: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateVolunteerExperience(criteria,objToUpdate);
			let result= await Services.UserBuildResumeService.getVolunteerExperience(payload);
			if(result.length ===0){
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isVolunteerExperiences : 0});
			}
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// volunteer experience module end

	//  project taken module start
	getProjectTaken: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getProjectTaken(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	
	addProjectTaken: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				projectTitle: Joi.string().optional(), 
				associatedWith:  Joi.string().optional(), 
				jobTitle:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				employementTypeId: Joi.string().optional(), 
				description: Joi.string().optional(), 
				location: Joi.string().optional(), 
				zipCode: Joi.string().optional(), 
				latitude: Joi.string().optional(), 
				longitude: Joi.string().optional(), 
				isCurrentlyOngoing: Joi.number().optional(),
				projectMembers: Joi.array().items(Joi.object()).optional(),
				projectLinks: Joi.array().items(Joi.string()).optional(),
				projectMedia: Joi.array().items(Joi.object()).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "projectTitle") && payloadData.projectTitle != "") objToSave.projectTitle = payload.projectTitle;
			if (_.has(payloadData, "associatedWith") && payloadData.associatedWith != "") objToSave.associatedWith = payload.associatedWith;
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToSave.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToSave.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToSave.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			if (_.has(payloadData, "isCurrentlyOngoing") && payloadData.isCurrentlyOngoing != "") objToSave.isCurrentlyOngoing = payload.isCurrentlyOngoing;
			if (_.has(payloadData, "location") && payloadData.location != "") objToSave.location = payload.location;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToSave.zipCode = payload.zipCode;
			if (_.has(payloadData, "latitude") && payloadData.latitude != "") objToSave.latitude = payload.latitude;
			if (_.has(payloadData, "longitude") && payloadData.longitude != "") objToSave.longitude = payload.longitude;

			let project= await Services.UserBuildResumeService.saveProjectTaken(objToSave);
			let criteria ={
				id: project.id,
				userId: payload.userId
			};
			if(payload.projectMembers && payload.projectMembers.length > 0)
			{
				await Services.UserBuildResumeService.saveBulkEntriesForProjectMembers(payload.projectMembers,criteria);
			}
			if(payload.projectLinks && payload.projectLinks.length > 0)
			{
				await Services.UserBuildResumeService.saveBulkEntriesForProjectLinks(payload.projectLinks,criteria);
			}
			if(payload.projectMedia && payload.projectMedia.length > 0)
			{
				await Services.UserBuildResumeService.saveBulkEntriesForProjectDocuments(payload.projectMedia,criteria);
			}
			await lastUpdateStep(payload, {isProjectUnderTaken : 1, isSteped:8});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isProjectUnderTaken : 1});


			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateProjectTaken: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				projectTitle: Joi.string().optional(), 
				associatedWith:  Joi.string().optional(), 
				jobTitle:  Joi.string().optional(), 
				fromDate: Joi.string().optional(), 
				toDate: Joi.string().optional(), 
				employementTypeId: Joi.string().optional(), 
				description: Joi.string().optional(), 
				location: Joi.string().optional(), 
				zipCode: Joi.string().optional(), 
				latitude: Joi.string().optional(), 
				longitude: Joi.string().optional(),  
				isCurrentlyOngoing: Joi.number().optional(),
				projectMembers: Joi.array().items(Joi.object()).optional(),
				projectLinks: Joi.array().items(Joi.string()).optional(),
				projectMedia: Joi.array().items(Joi.object()).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				projectTitle: null,
				associatedWith: null,
				fromDate: null,
				toDate: null,
				jobTitle: null,
				description: null,
				zipCode: null,
				latitude: null,
				longitude: null
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToUpdate.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "projectTitle") && payloadData.projectTitle != "") objToUpdate.projectTitle = payload.projectTitle;
			if (_.has(payloadData, "associatedWith") && payloadData.associatedWith != "") objToUpdate.associatedWith = payload.associatedWith;
			if (_.has(payloadData, "jobTitle") && payloadData.jobTitle != "") objToUpdate.jobTitle = payload.jobTitle;
			if (_.has(payloadData, "fromDate") && payloadData.fromDate != "") objToUpdate.fromDate = payload.fromDate;
			if (_.has(payloadData, "toDate") && payloadData.toDate != "") objToUpdate.toDate = payload.toDate;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			if (_.has(payloadData, "location") && payloadData.location != "") objToUpdate.location = payload.location;
			if (_.has(payloadData, "zipCode") && payloadData.zipCode != "") objToUpdate.zipCode = payload.zipCode;
			if (_.has(payloadData, "latitude") && payloadData.latitude != "") objToUpdate.latitude = payload.latitude;
			if (_.has(payloadData, "longitude") && payloadData.longitude != "") objToUpdate.longitude = payload.longitude;
			if (_.has(payloadData, "isCurrentlyOngoing") ) objToUpdate.isCurrentlyOngoing = payload.isCurrentlyOngoing;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateProjectTaken(criteria,objToUpdate);
			criteria.userId= payload.userId;
			await Services.UserBuildResumeService.deleteRecords(Models.UserProjectTeamMembers,{projectId: payload.id});
			if(payload.projectMembers && payload.projectMembers.length > 0)
			{
				await Services.UserBuildResumeService.saveBulkEntriesForProjectMembers(payload.projectMembers,criteria);
			}
			await Services.UserBuildResumeService.deleteRecords(Models.UserProjectLinks,{projectId: payload.id});
			if(payload.projectLinks && payload.projectLinks.length > 0)
			{
				await Services.UserBuildResumeService.saveBulkEntriesForProjectLinks(payload.projectLinks,criteria);
			}
			await Services.UserBuildResumeService.deleteRecords(Models.UserProjectDocuments,{projectId: payload.id});
			if(payload.projectMedia && payload.projectMedia.length > 0)
			{
				await Services.UserBuildResumeService.saveBulkEntriesForProjectDocuments(payload.projectMedia,criteria);
			}
			await lastUpdateStep(payload, {isProjectUnderTaken : 1, isSteped:8});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isProjectUnderTaken : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",6);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteProjectTaken: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateProjectTaken(criteria,objToUpdate);
			await Services.UserBuildResumeService.deleteRecords(Models.UserProjectTeamMembers,{projectId: payload.id});
			await Services.UserBuildResumeService.deleteRecords(Models.UserProjectDocuments,{projectId: payload.id});
			await Services.UserBuildResumeService.deleteRecords(Models.UserProjectLinks,{projectId: payload.id});
			let result= await Services.UserBuildResumeService.getProjectTaken(payload);
			if (result.length ===0) {
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isProjectUnderTaken : 0});
			}

			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// project taken module end


	//  awards and honors module start
	getAwardsAndHonors: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getAwardsAndHonors(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	
	addAwardsAndHonors: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				name: Joi.string().optional(), 
				associatedWith:  Joi.string().optional(), 
				issuer:  Joi.string().optional(),
				issuesedOn: Joi.string().optional(), 
				description: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
			if (_.has(payloadData, "issuer") && payloadData.issuer != "") objToSave.issuer = payload.issuer;
			if (_.has(payloadData, "associatedWith") && payloadData.associatedWith != "") objToSave.associatedWith = payload.associatedWith;
			if (_.has(payloadData, "issuesedOn") && payloadData.issuesedOn != "") objToSave.issuesedOn = payload.issuesedOn;
			if (_.has(payloadData, "description") && payloadData.description != "") objToSave.description = payload.description;
			objToSave.isType = 1;
			await Services.UserBuildResumeService.saveAwardsAndHonors(objToSave);
			await lastUpdateStep(payload, {isAwardHonors : 1, isSteped:9});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);

			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isAwardHonors : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateAwardsAndHonors: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				name: Joi.string().optional(), 
				associatedWith:  Joi.string().optional(), 
				issuer:  Joi.string().optional(),
				issuesedOn: Joi.string().optional(), 
				description: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				name:null,
				associatedWith:null,
				description:null,
				issuer:null,
				issuesedOn:null
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "name") && payloadData.name != "") objToUpdate.name = payload.name;
			if (_.has(payloadData, "issuer") && payloadData.issuer != "") objToUpdate.issuer = payload.issuer;
			if (_.has(payloadData, "associatedWith") && payloadData.associatedWith != "") objToUpdate.associatedWith = payload.associatedWith;
			if (_.has(payloadData, "issuesedOn") && payloadData.issuesedOn != "") objToUpdate.issuesedOn = payload.issuesedOn;
			if (_.has(payloadData, "description") && payloadData.description != "") objToUpdate.description = payload.description;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateAwardsAndHonors(criteria,objToUpdate);
			await lastUpdateStep(payload, {isAwardHonors : 1, isSteped:9});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isAwardHonors : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",7);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteAwardsAndHonors: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateAwardsAndHonors(criteria,objToUpdate);
			let result= await Services.UserBuildResumeService.getAwardsAndHonors(payload);
			if (result.length ===0) {
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isAwardHonors : 0});
			}
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// awards and honors module end

	// license and certification module start
	getLicenseAndCertification: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getLicenseAndCertification(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	
	addLicenseAndCertification: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				name: Joi.string().optional(), 
				credentialUrl: Joi.string().optional(), 
				certificationNo:  Joi.string().optional(), 
				attestedByAuthority:  Joi.string().optional(),
				issuesedOn: Joi.string().optional(), 
				expirydate: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
			if (_.has(payloadData, "credentialUrl") && payloadData.credentialUrl != "") objToSave.credentialUrl = payload.credentialUrl;
			if (_.has(payloadData, "certificationNo") && payloadData.certificationNo != "") objToSave.certificationNo = payload.certificationNo;
			if (_.has(payloadData, "issuesedOn") && payloadData.issuesedOn != "") objToSave.issuesedOn = payload.issuesedOn;
			if (_.has(payloadData, "expirydate") && payloadData.expirydate != "") objToSave.expirydate = payload.expirydate;
			if (_.has(payloadData, "attestedByAuthority") && payloadData.attestedByAuthority != "") objToSave.attestedByAuthority = payload.attestedByAuthority;
			
			await Services.UserBuildResumeService.saveLicenseAndCertification(objToSave);
			await lastUpdateStep(payload, {isCertification : 1, isSteped:10});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isCertification : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateLicenseAndCertification: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				name: Joi.string().optional(), 
				credentialUrl: Joi.string().optional(), 
				certificationNo:  Joi.string().optional(), 
				attestedByAuthority:  Joi.string().optional(),
				issuesedOn: Joi.string().optional(), 
				expirydate: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={
				name:null,
				credentialUrl:null,
				certificationNo:null,
				issuesedOn:null,
				expirydate:null,
				attestedByAuthority:null
			};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "name") && payloadData.name != "") objToUpdate.name = payload.name;
			if (_.has(payloadData, "credentialUrl") && payloadData.credentialUrl != "") objToUpdate.credentialUrl = payload.credentialUrl;
			if (_.has(payloadData, "certificationNo") && payloadData.certificationNo != "") objToUpdate.certificationNo = payload.certificationNo;
			if (_.has(payloadData, "issuesedOn") && payloadData.issuesedOn != "") objToUpdate.issuesedOn = payload.issuesedOn;
			if (_.has(payloadData, "expirydate") && payloadData.expirydate != "") objToUpdate.expirydate = payload.expirydate;
			if (_.has(payloadData, "attestedByAuthority") && payloadData.attestedByAuthority != "") objToUpdate.attestedByAuthority = payload.attestedByAuthority;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateLicenseAndCertification(criteria,objToUpdate);
			await lastUpdateStep(payload, {isCertification : 1, isSteped:10});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isCertification : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",8);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteLicenseAndCertification: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateLicenseAndCertification(criteria,objToUpdate);
			let result= await Services.UserBuildResumeService.getLicenseAndCertification(payload);
			if (result.length ===0) {
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isCertification : 0});
			}
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// license and certification module end

	// language module start
	getLanguage: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result= await Services.UserBuildResumeService.getLanguage(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
		
	addLanguage: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				language: Joi.string().optional(), 
				proficiency: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "language") && payloadData.language != "") objToSave.language = payload.language;
			if (_.has(payloadData, "proficiency") && payloadData.proficiency != "") objToSave.proficiency = payload.proficiency;

			await Services.UserBuildResumeService.saveLanguage(objToSave);
			await lastUpdateStep(payload, {isLanguages : 1, isSteped:11});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isLanguages : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	addLanguageMultiple: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				language: Joi.string().optional(), 
				proficiency: Joi.string().optional(),
				languageProficiency: Joi.array().items(Joi.object()).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			if(payload.languageProficiency&&payload.languageProficiency.length>0){
				await Services.UserBuildResumeService.deleteRecords(Models.UserLanguages, {userId:payload.userId});
				let objToSave=payload.languageProficiency.map(value => ({...value, userId:payload.userId}));
				let addsuccess=await Services.UserBuildResumeService.saveLanguageBulk(objToSave);
				if(addsuccess){
					await lastUpdateStep(payload, {isLanguages : 1, isSteped:11});
					// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
					await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isLanguages : 1});
					return message.success.ADDED;
				} 
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	updateLanguage: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				language: Joi.string().optional(), 
				proficiency: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "language") && payloadData.language != "") objToUpdate.language = payload.language;
			if (_.has(payloadData, "proficiency") && payloadData.proficiency != "") objToUpdate.proficiency = payload.proficiency;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateLanguage(criteria,objToUpdate);
			await lastUpdateStep(payload, {isLanguages : 1, isSteped:11});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isLanguages : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",9);
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteLanguage: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateLanguage(criteria,objToUpdate);
			let result= await Services.UserBuildResumeService.getLanguage(payload);
			if(result.length ===0){
				await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isLanguages : 0});	
			}
			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// language module end

	// job preferences module start
	getJobPreference: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let result = {};
			result.getJobPreference= await Services.UserBuildResumeService.getJobPreference(payload);
			result.userTourOfDuties= await Services.UserBuildResumeService.getUserTourOfDuties(payload);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	addJobPreference: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				desiredSalary: Joi.string().optional(), 
				desiredSalaryType: Joi.string().optional(),
				serviceId: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				workPlace: Joi.string().optional(),
				dateOfAvailability: Joi.string().optional(),
				securityClearance: Joi.array().items(Joi.string()).optional(),
				travelRequirement: Joi.array().items(Joi.string()).optional(),
				willingToRelocate : Joi.number().optional(),
				covidVaccinated : Joi.number().optional(),
				jobTitleIds: Joi.array().items(Joi.string()).optional(),
				industryIds: Joi.array().items(Joi.string()).optional(),
				locations: Joi.array().items(Joi.object()).optional(),
				tourOfDuties: Joi.array().items(Joi.object()).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "desiredSalary") && payloadData.desiredSalary != "") objToSave.desiredSalary = payload.desiredSalary;
			if (_.has(payloadData, "desiredSalaryType") && payloadData.desiredSalaryType != "") objToSave.desiredSalaryType = payload.desiredSalaryType;
			if (_.has(payloadData, "serviceId") && payloadData.serviceId != "") objToSave.serviceId = payload.serviceId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "workPlace") && payloadData.workPlace != "") objToSave.workPlace = payload.workPlace;
			if (_.has(payloadData, "willingToRelocate") && payloadData.willingToRelocate != "") objToSave.willingToRelocate = payload.willingToRelocate;
			if (_.has(payloadData, "covidVaccinated") && payloadData.covidVaccinated != "") objToSave.covidVaccinated = payload.covidVaccinated;
			if (_.has(payloadData, "dateOfAvailability") && payloadData.dateOfAvailability != "") objToSave.dateOfAvailability = payload.dateOfAvailability;
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferences,{userId:payload.userId});
			let jobPreference= await Services.UserBuildResumeService.saveJobPreference(objToSave);
			let criteria ={
				id : jobPreference.id,
				userId:payload.userId
			};
			if(payload.jobTitleIds && payload.jobTitleIds.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesJobTitles,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceJobTitles(payload.jobTitleIds,criteria);
			}
			if(payload.industryIds && payload.industryIds.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesIndustries,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceIndustries(payload.industryIds,criteria);
			}
			if(payload.locations && payload.locations.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesLocations,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceLocations(payload.locations,criteria);
			}
			if(payload.tourOfDuties && payload.tourOfDuties.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserTourOfDuties,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTourOfDuties(payload.tourOfDuties,criteria);
			}
			if(payload.securityClearance && payload.securityClearance.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceSecurityClearance,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserSecurityClearance(payload.securityClearance,criteria);
			}
			if(payload.travelRequirement && payload.travelRequirement.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceTravelRequirements,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTravelRequirements(payload.travelRequirement,criteria);
			}
			await lastUpdateStep(payload, {isPreferences : 1, isSteped:12});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isPreferences : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},	
	addJobPreference_Old: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				desiredSalary: Joi.string().optional(), 
				desiredSalaryType: Joi.string().optional(),
				serviceId: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				workPlace: Joi.string().optional(),
				dateOfAvailability: Joi.string().optional(),
				securityClearance: Joi.array().items(Joi.object()).optional(),
				travelRequirement: Joi.array().items(Joi.object()).optional(),
				willingToRelocate : Joi.number().optional(),
				covidVaccinated : Joi.number().optional(),
				jobTitleIds: Joi.array().items(Joi.object()).optional(),
				industryIds: Joi.array().items(Joi.object()).optional(),
				locations: Joi.array().items(Joi.object()).optional(),
				tourOfDuties: Joi.array().items(Joi.object()).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "desiredSalary") && payloadData.desiredSalary != "") objToSave.desiredSalary = payload.desiredSalary;
			if (_.has(payloadData, "desiredSalaryType") && payloadData.desiredSalaryType != "") objToSave.desiredSalaryType = payload.desiredSalaryType;
			if (_.has(payloadData, "serviceId") && payloadData.serviceId != "") objToSave.serviceId = payload.serviceId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "workPlace") && payloadData.workPlace != "") objToSave.workPlace = payload.workPlace;
			if (_.has(payloadData, "willingToRelocate") && payloadData.willingToRelocate != "") objToSave.willingToRelocate = payload.willingToRelocate;
			if (_.has(payloadData, "covidVaccinated") && payloadData.covidVaccinated != "") objToSave.covidVaccinated = payload.covidVaccinated;
			if (_.has(payloadData, "dateOfAvailability") && payloadData.dateOfAvailability != "") objToSave.dateOfAvailability = payload.dateOfAvailability;
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferences,{userId:payload.userId});
			let jobPreference= await Services.UserBuildResumeService.saveJobPreference(objToSave);
			let criteria ={
				id : jobPreference.id,
				userId:payload.userId
			};
			if(payload.jobTitleIds && payload.jobTitleIds.length > 0)
			{	let jobTitleIdsArr = payload.jobTitleIds.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesJobTitles,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkObjEntriesForUserPreferenceJobTitles(jobTitleIdsArr);
			}
			if(payload.industryIds && payload.industryIds.length > 0)
			{
				let jobIndustriesArr = payload.industryIds.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesIndustries,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkObjEntriesForUserPreferenceIndustries(jobIndustriesArr);
			}
			if(payload.locations && payload.locations.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesLocations,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceLocations(payload.locations,criteria);
			}
			if(payload.tourOfDuties && payload.tourOfDuties.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserTourOfDuties,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTourOfDuties(payload.tourOfDuties,criteria);
			}
			if(payload.securityClearance && payload.securityClearance.length > 0)
			{	let securityArr = payload.securityClearance.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceSecurityClearance,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkObjEntriesForUserSecurityClearance(securityArr);
			}
			if(payload.travelRequirement && payload.travelRequirement.length > 0)
			{
				let travelRequirementsArr = payload.travelRequirement.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceTravelRequirements,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTravelRequirementsV1(travelRequirementsArr);
			}
			await lastUpdateStep(payload, {isPreferences : 1, isSteped:12});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isPreferences : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	addJobPreferenceV1: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				desiredSalary: Joi.string().optional(), 
				desiredSalaryType: Joi.string().optional(),
				serviceId: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				otherServiceTitle: Joi.string().optional(),
				workPlace: Joi.string().optional(),
				dateOfAvailability: Joi.string().optional(),
				securityClearance: Joi.array().items(Joi.object()).optional(),
				travelRequirement: Joi.array().items(Joi.object()).optional(),
				willingToRelocate : Joi.number().optional(),
				covidVaccinated : Joi.number().optional(),
				jobTitleIds: Joi.array().items(Joi.object()).optional(),
				industryIds: Joi.array().items(Joi.object()).optional(),
				locations: Joi.array().items(Joi.object()).optional(),
				tourOfDuties: Joi.array().items(Joi.object()).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToSave.userId = payload.userId;
			if (_.has(payloadData, "desiredSalary") && payloadData.desiredSalary != "") objToSave.desiredSalary = payload.desiredSalary;
			if (_.has(payloadData, "desiredSalaryType") && payloadData.desiredSalaryType != "") objToSave.desiredSalaryType = payload.desiredSalaryType;
			if (_.has(payloadData, "serviceId") && payloadData.serviceId != "") objToSave.serviceId = payload.serviceId;
			if (_.has(payloadData, "otherServiceTitle") && payloadData.otherServiceTitle != "") objToSave.otherServiceTitle = payload.otherServiceTitle;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToSave.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "workPlace") && payloadData.workPlace != "") objToSave.workPlace = payload.workPlace;
			if (_.has(payloadData, "willingToRelocate") && payloadData.willingToRelocate != "") objToSave.willingToRelocate = payload.willingToRelocate;
			if (_.has(payloadData, "covidVaccinated") && payloadData.covidVaccinated != "") objToSave.covidVaccinated = payload.covidVaccinated;
			if (_.has(payloadData, "dateOfAvailability") && payloadData.dateOfAvailability != "") objToSave.dateOfAvailability = payload.dateOfAvailability;
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferences,{userId:payload.userId});
			let jobPreference= await Services.UserBuildResumeService.saveJobPreference(objToSave);
			let criteria ={
				id : jobPreference.id,
				userId:payload.userId
			};
			if(payload.jobTitleIds && payload.jobTitleIds.length > 0)
			{	let jobTitleIdsArr = payload.jobTitleIds.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesJobTitles,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkObjEntriesForUserPreferenceJobTitles(jobTitleIdsArr);
			}
			if(payload.industryIds && payload.industryIds.length > 0)
			{
				let jobIndustriesArr = payload.industryIds.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesIndustries,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkObjEntriesForUserPreferenceIndustries(jobIndustriesArr);
			}
			if(payload.locations && payload.locations.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesLocations,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceLocations(payload.locations,criteria);
			}
			if(payload.tourOfDuties && payload.tourOfDuties.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserTourOfDuties,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTourOfDuties(payload.tourOfDuties,criteria);
			}
			if(payload.securityClearance && payload.securityClearance.length > 0)
			{	let securityArr = payload.securityClearance.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceSecurityClearance,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkObjEntriesForUserSecurityClearance(securityArr);
			}
			if(payload.travelRequirement && payload.travelRequirement.length > 0)
			{
				let travelRequirementsArr = payload.travelRequirement.map(value => ({...value, jobPreferenceId:jobPreference.id, userId:payload.userId}));
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceTravelRequirements,{userId:payload.userId});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTravelRequirementsV1(travelRequirementsArr);
			}
			await lastUpdateStep(payload, {isPreferences : 1, isSteped:12});
			let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
			if (checkResumeStatus.isPreferences===1) {
				await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",10);
			}
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isPreferences : 1});

			return message.success.ADDED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateJobPreference: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().required(),   
				userId: Joi.string().required(),  
				desiredSalary: Joi.string().optional(), 
				desiredSalaryType: Joi.string().optional(),
				serviceId: Joi.string().optional(),
				employementTypeId: Joi.string().optional(),
				workPlace: Joi.string().optional(),
				dateOfAvailability: Joi.string().optional(),
				securityClearance: Joi.array().items(Joi.string()).optional(),
				travelRequirement: Joi.array().items(Joi.string()).optional(),
				willingToRelocate : Joi.number().optional(),
				covidVaccinated : Joi.number().optional(),
				jobTitleIds: Joi.array().items(Joi.string()).optional(),
				industryIds: Joi.array().items(Joi.string()).optional(),
				locations: Joi.array().items(Joi.object()).optional(),
				tourOfDuties: Joi.array().items(Joi.object()).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToUpdate={};
			if (_.has(payloadData, "userId") && payloadData.userId != "") objToUpdate.userId = payload.userId;
			if (_.has(payloadData, "desiredSalary") && payloadData.desiredSalary != "") objToUpdate.desiredSalary = payload.desiredSalary;
			if (_.has(payloadData, "desiredSalaryType") && payloadData.desiredSalaryType != "") objToUpdate.desiredSalaryType = payload.desiredSalaryType;
			if (_.has(payloadData, "serviceId") && payloadData.serviceId != "") objToUpdate.serviceId = payload.serviceId;
			if (_.has(payloadData, "employementTypeId") && payloadData.employementTypeId != "") objToUpdate.employementTypeId = payload.employementTypeId;
			if (_.has(payloadData, "workPlace") && payloadData.workPlace != "") objToUpdate.workPlace = payload.workPlace;
			if (_.has(payloadData, "willingToRelocate") ) objToUpdate.willingToRelocate = payload.willingToRelocate;
			if (_.has(payloadData, "covidVaccinated") ) objToUpdate.covidVaccinated = payload.covidVaccinated;
			if (_.has(payloadData, "dateOfAvailability") ) objToUpdate.dateOfAvailability = payload.dateOfAvailability;
			let criteria={
				id: payload.id
			};
			await Services.UserBuildResumeService.updateJobPreference(criteria,objToUpdate);
			if(payload.jobTitleIds && payload.jobTitleIds.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesJobTitles,{jobPreferenceId: payload.id});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceJobTitles(payload.jobTitleIds,criteria);
			}
			if(payload.industryIds && payload.industryIds.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesIndustries,{jobPreferenceId: payload.id});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceIndustries(payload.industryIds,criteria);
			}
			if(payload.locations && payload.locations.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesLocations,{jobPreferenceId: payload.id});
				await Services.UserBuildResumeService.saveBulkEntriesForUserPreferenceLocations(payload.locations,criteria);
			}
			if(payload.tourOfDuties && payload.tourOfDuties.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserTourOfDuties,{jobPreferenceId: payload.id});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTourOfDuties(payload.tourOfDuties,criteria);
			}
			if(payload.securityClearance && payload.securityClearance.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceSecurityClearance,{jobPreferenceId: payload.id});
				await Services.UserBuildResumeService.saveBulkEntriesForUserSecurityClearance(payload.securityClearance,criteria);
			}
			if(payload.travelRequirement && payload.travelRequirement.length > 0)
			{
				await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceTravelRequirements,{jobPreferenceId: payload.id});
				await Services.UserBuildResumeService.saveBulkEntriesForUserTravelRequirements(payload.travelRequirement,criteria);
			}
			await lastUpdateStep(payload, {isPreferences : 1, isSteped:12});
			// let checkResumeStatus= await Services.UserBuildResumeService.getByIdResumeStatus(payload);

			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isPreferences : 1});
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isLanguages : 1});
			await notificationSend(payload.userId,"Profile Updated","Your profile has been updated successfully",10);
			
			return message.success.UPDATED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteJobPreference: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria={
				id: payload.id
			};
			let objToUpdate={
				isDeleted : 1
			};
			await Services.UserBuildResumeService.updateJobPreference(criteria,objToUpdate);
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesLocations,{jobPreferenceId: payload.id});
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesJobTitles,{jobPreferenceId: payload.id});
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferencesIndustries,{jobPreferenceId: payload.id});
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceTravelRequirements,{jobPreferenceId: payload.id});
			await Services.UserBuildResumeService.deleteRecords(Models.UserJobPreferenceSecurityClearance,{jobPreferenceId: payload.id});

			return message.success.DELETED;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	// job preferences module end
	userReport: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria ={
				userId: payload.userId
			};
			let criteriaSearch = {
				isBlocked:"0",
				isDeleted:"0"
			};
			let projection = ["id", "title",  [Sequelize.fn("count", Sequelize.col("title")), "manyTime"]
			];
			let result = {};
			result.searchAppearance = await Services.BaseService.count(Models.RecruiterSearchAppearance, criteria);
			result.profileView = await Services.ReportServices.count(Models.RecruiterView, {userId: payload.userId, actionType:0});
			result.recruiterAction = await Services.ReportServices.count(Models.RecruiterView, {userId: payload.userId});
			result.topSearchKeylist= await Services.ReportServices.getAllRecordsSearchCount(Models.RecruiterSearchKey, criteriaSearch, projection, 10, 0);

			return result;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	searchAppearance: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				filter: Joi.string().required(),  
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria ={
				userId: payload.userId
			};
			console.log(criteria);
			let criteriaSearch = {
				userId: payload.userId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let currentCount =0;
			let lastCount =0;
			let graphData =[];
			if (payload.filter ==="7Days") {
				console.log("hhh");
				// graphData = [0,0,0,0,0,0,0];
				let weeklyEarning = await Services.ReportServices.getWeekEarningChart( criteriaSearch);
				// 	 if (weeklyEarning!=undefined) {
				// for(let i = 0; i < weeklyEarning.length; i++){
				//     var index= weeklyEarning[i].dayOfWeek-1;
				//     	graphData[index]=parseFloat(weeklyEarning[i].amount);
				//     }
				// }
				const startDate = moment().format("YYYY-MM-DD");
				const endDate = moment().subtract(7,"d").format("YYYY-MM-DD");
				const lastEndDate = moment().subtract(14,"d").format("YYYY-MM-DD");

				currentCount = await Services.ReportServices.countSearchAppperance(criteriaSearch, startDate, endDate);
				lastCount = await Services.ReportServices.countSearchAppperance(criteriaSearch, endDate, lastEndDate);

				let fromDate = moment(endDate);
				let toDate = moment(startDate);
				let type ="days";
				let diff = toDate.diff(fromDate, type);
				let range = [];
				for (let i = 0; i < diff; i++) {
					var query = " ";
					if (i == 0) {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					} else {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					}
					range.push(query);
				}
				await Promise.all(
					range.map(async (rangDate) => {
						var weeklyData =weeklyEarning.find(element => element.graphdate == rangDate);
						// console.log(rangDate, "rangDate")
						if (weeklyData !== undefined) {
							graphData.push({date:weeklyData.graphdate, count:weeklyData.amount });
						} else {
							graphData.push({date:rangDate, count:0 });
						}

					})
				);
			}
			if (payload.filter ==="30Days") {
				let monthlyEarning = await Services.ReportServices.getMonthEarningChart( criteriaSearch);
				/*graphData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	          if (monthlyEarning!=undefined) {
	            for(let i = 0; i < monthlyEarning.length; i++){
	                var index= monthlyEarning[i].day-1;
	                	graphData[index]=parseFloat(monthlyEarning[i].amount);
	                }
	            }*/
				const startDate = moment().format("YYYY-MM-DD");
				const endDate = moment().subtract(30,"d").format("YYYY-MM-DD");
				const lastEndDate = moment().subtract(60,"d").format("YYYY-MM-DD");

				currentCount = await Services.ReportServices.countSearchAppperance(criteriaSearch, startDate, endDate);
				lastCount = await Services.ReportServices.countSearchAppperance(criteriaSearch, endDate, lastEndDate);

				let fromDate = moment(endDate);
				let toDate = moment(startDate);
				let type ="days";
				let diff = toDate.diff(fromDate, type);
				let range = [];
				for (let i = 0; i < diff; i++) {
					var query = " ";
					if (i == 0) {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					} else {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					}
					range.push(query);
				}
				await Promise.all(
					range.map(async (rangDate) => {
						var weeklyData =monthlyEarning.find(element => element.graphdate == rangDate);
						// console.log(rangDate, "rangDate")
						if (weeklyData !== undefined) {
							graphData.push({date:weeklyData.graphdate, count:weeklyData.amount });
						} else {
							graphData.push({date:rangDate, count:0 });
						}

					})
				);

			}
			if (payload.filter ==="90Days") {
				let yearlyEarning = await Services.ReportServices.getYearEarningChart(criteriaSearch);
				// graphData = [0,0,0,0,0,0,0,0,0,0,0,0];
				// if (yearlyEarning!=undefined) {
				//   for(let i = 0; i < yearlyEarning.length; i++){
				//       var index= yearlyEarning[i].month-1;
				//       	graphData[index]=parseFloat(yearlyEarning[i].amount);
				//       }
				//   } 
				const startDate = moment().format("YYYY-MM-DD");
				const endDate = moment().subtract(90,"d").format("YYYY-MM-DD");
				const lastEndDate = moment().subtract(180,"d").format("YYYY-MM-DD");

				currentCount = await Services.ReportServices.countSearchAppperance(criteriaSearch, startDate, endDate);
				lastCount = await Services.ReportServices.countSearchAppperance(criteriaSearch, endDate, lastEndDate);

				let fromDate = moment(endDate);
				let toDate = moment(startDate);
				let type ="days";
				let diff = toDate.diff(fromDate, type);
				let range = [];
				for (let i = 0; i < diff; i++) {
					var query = " ";
					if (i == 0) {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					} else {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					}
					range.push(query);
				}
				await Promise.all(
					range.map(async (rangDate) => {
						var weeklyData =yearlyEarning.find(element => element.graphdate == rangDate);
						// console.log(rangDate, "rangDate")
						if (weeklyData !== undefined) {
							graphData.push({date:weeklyData.graphdate, count:weeklyData.amount });
						} else {
							graphData.push({date:rangDate, count:0 });
						}

					})
				);

			}
			return {graph: graphData, current: currentCount, last: lastCount};

		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	searchViewGraph: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),  
				filter: Joi.string().required(),  
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria ={
				userId: payload.userId
			};
			let criteriaSearch = {
				userId: payload.userId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let graphData =[];
			let currentCount =0;
			let lastCount =0;
			if (payload.filter ==="7Days") {
				// graphData = [0,0,0,0,0,0,0];
				let weeklyEarning = await Services.ReportServices.getWeekViewChart( criteriaSearch);
				// 	 if (weeklyEarning!=undefined) {
				// for(let i = 0; i < weeklyEarning.length; i++){
				//     var index= weeklyEarning[i].dayOfWeek-1;
				//     graphData[index]=parseFloat(weeklyEarning[i].amount);
				//     }
				// }
				const startDate = moment().format("YYYY-MM-DD");
				const endDate = moment().subtract(7,"d").format("YYYY-MM-DD");
				const lastEndDate = moment().subtract(14,"d").format("YYYY-MM-DD");

				currentCount = await Services.ReportServices.countUserView(criteriaSearch, startDate, endDate);
				lastCount = await Services.ReportServices.countUserView(criteriaSearch, endDate, lastEndDate);

				let fromDate = moment(endDate);
				let toDate = moment(startDate);
				let type ="days";
				let diff = toDate.diff(fromDate, type);
				let range = [];
				for (let i = 0; i < diff; i++) {
					var query = " ";
					if (i == 0) {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					} else {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					}
					range.push(query);
				}
				await Promise.all(
					range.map(async (rangDate) => {
						var weeklyData =weeklyEarning.find(element => element.graphdate == rangDate);
						// console.log(rangDate, "rangDate")
						if (weeklyData !== undefined) {
							graphData.push({date:weeklyData.graphdate, count:weeklyData.amount });
						} else {
							graphData.push({date:rangDate, count:0 });
						}

					})
				);

			}
			if (payload.filter ==="30Days") {
				let monthlyEarning = await Services.ReportServices.getMonthViewChart( criteriaSearch);
				//  graphData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				// if (monthlyEarning!=undefined) {
				//   for(let i = 0; i < monthlyEarning.length; i++){
				//       var index= monthlyEarning[i].day-1;
				//       graphData[index]=parseFloat(monthlyEarning[i].amount);
				//       }
				//   }
				const startDate = moment().format("YYYY-MM-DD");
				const endDate = moment().subtract(30,"d").format("YYYY-MM-DD");
				const lastEndDate = moment().subtract(60,"d").format("YYYY-MM-DD");

				currentCount = await Services.ReportServices.countUserView(criteriaSearch, startDate, endDate);
				lastCount = await Services.ReportServices.countUserView(criteriaSearch, endDate, lastEndDate);

				let fromDate = moment(endDate);
				let toDate = moment(startDate);
				let type ="days";
				let diff = toDate.diff(fromDate, type);
				let range = [];
				for (let i = 0; i < diff; i++) {
					var query = " ";
					if (i == 0) {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					} else {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					}
					range.push(query);
				}
				await Promise.all(
					range.map(async (rangDate) => {
						var monthlyData =monthlyEarning.find(element => element.graphdate == rangDate);
						// console.log(rangDate, "rangDate")
						if (monthlyData !== undefined) {
							graphData.push({date:monthlyData.graphdate, count:monthlyData.amount });
						} else {
							graphData.push({date:rangDate, count:0 });
						}

					})
				);

			}
			if (payload.filter ==="90Days") {
				let yearlyEarning = await Services.ReportServices.getMonth90ViewChart(criteriaSearch);
				// graphData = [0,0,0,0,0,0,0,0,0,0,0,0];
				// if (yearlyEarning!=undefined) {
				//   for(let i = 0; i < yearlyEarning.length; i++){
				//       var index= yearlyEarning[i].month-1;
				//       graphData[index]=parseFloat(yearlyEarning[i].amount);
				//       }
				//   }
				const startDate = moment().format("YYYY-MM-DD");
				const endDate = moment().subtract(90,"d").format("YYYY-MM-DD");

				const lastEndDate = moment().subtract(180,"d").format("YYYY-MM-DD");

				currentCount = await Services.ReportServices.countUserView(criteriaSearch, startDate, endDate);
				lastCount = await Services.ReportServices.countUserView(criteriaSearch, endDate, lastEndDate);

				let fromDate = moment(endDate);
				let toDate = moment(startDate);
				let type ="days";
				let diff = toDate.diff(fromDate, type);
				let range = [];
				for (let i = 0; i < diff; i++) {
					var query = " ";
					if (i == 0) {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					} else {
						query = moment(startDate).subtract(i, type).format("YYYY-MM-DD");
					}
					range.push(query);
				}
				await Promise.all(
					range.map(async (rangDate) => {
						var monthlyData =yearlyEarning.find(element => element.graphdate == rangDate);
						// console.log(rangDate, "rangDate")
						if (monthlyData !== undefined) {
							graphData.push({date:monthlyData.graphdate, count:monthlyData.amount });
						} else {
							graphData.push({date:rangDate, count:0 });
						}

					})
				); 
			}
			if (payload.filter ==="7Days") {
				criteriaSearch.startDate = moment().subtract(7, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.filter ==="30Days") {
				criteriaSearch.startDate = moment().subtract(30, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.filter ==="90Days") {
				criteriaSearch.startDate = moment().subtract(90, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			let projection = ["id", "recuiterId", "createdAt"];
			let listing =await Services.ReportServices.getRecruiterViewList(criteriaSearch, projection, 2, 0);
			return {graph :graphData, recrutier: listing, current: currentCount, last: lastCount};

		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	recruiterAction: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				filter: Joi.string().required(),
				limit: Joi.number().required(),
				skip: Joi.number().required(),  
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteriaSearch = {
				userId: payload.userId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let result = {};
			if (payload.filter==="view") {
				criteriaSearch.actionType =0;
			}
			if (payload.filter==="download") {
				criteriaSearch.actionType =1;
			}
			if (payload.filter==="mail") {
				criteriaSearch.actionType =2;
			}
			if (payload.filter ==="7Days") {
				criteriaSearch.startDate = moment().subtract(7, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.filter ==="30Days") {
				criteriaSearch.startDate = moment().subtract(30, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.filter ==="90Days") {
				criteriaSearch.startDate = moment().subtract(90, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}

			let projection = ["id", "recuiterId", "createdAt", "actionType"];
			result.listing = await Services.ReportServices.getRecruiterViewList(criteriaSearch, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.totalAllCount = await Services.ReportServices.count(Models.RecruiterView, {userId: payload.userId});
			result.totalViewCount = await Services.ReportServices.count(Models.RecruiterView, {userId: payload.userId, actionType:0});
			result.totalDownloadCount = await Services.ReportServices.count(Models.RecruiterView, {userId: payload.userId, actionType:1});
			result.totalMailCount = await Services.ReportServices.count(Models.RecruiterView, {userId: payload.userId, actionType:2});

			return result;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
	viewlisting: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				filter: Joi.string().required(),
				limit: Joi.number().required(),
				skip: Joi.number().required(),  
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteriaSearch = {
				userId: payload.userId,
				isBlocked:"0",
				isDeleted:"0"
			};
			let result = {};
			criteriaSearch.actionType =0;
			if (payload.filter ==="7Days") {
				criteriaSearch.startDate = moment().subtract(7, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.filter ==="30Days") {
				criteriaSearch.startDate = moment().subtract(30, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.filter ==="90Days") {
				criteriaSearch.startDate = moment().subtract(90, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss");
				criteriaSearch.endDate = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}

			let projection = ["id", "recuiterId", "createdAt"];
			result.listing =await Services.ReportServices.getRecruiterViewList(criteriaSearch, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			result.totalCount = await Services.ReportServices.count(Models.RecruiterView, criteriaSearch);
			return result;
		}catch (err) {
			console.log(err);
			throw err;
		}
	},
};
let lastUpdateStep = async(payload, isStepedObj) =>{
	try {
		let checkResumeStatus1= await Services.UserBuildResumeService.getByIdResumeStatus(payload);
		console.log(isStepedObj, "isStepedObj1");
		if (checkResumeStatus1.isSteped <= isStepedObj.isSteped) {
			console.log(isStepedObj, "isStepedObj");
			await Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, isStepedObj);
		}
	}catch (err) {
		console.log(err);
		throw err;
	}
};

let notificationSend=async(userId,title,message,notificationType)=>{
	let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: userId}, ["deviceToken", "deviceType" ], 50, 0);
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
		userId: userId,
		title:title,
		message:message,
		notificationType:notificationType,
		userType: "0",
		deviceType: "0"
	};
	var dataNotification ={
		title:title,
		message:message,
		notificationType:notificationType.toString(),
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
};