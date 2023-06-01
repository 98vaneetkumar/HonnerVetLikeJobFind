const Joi = require("joi");
const _ = require("underscore");
// const Response = require("../../config/response");
let commonHelper = require("../../helpers/common");
// let config = require("../../config/env")();
let Services = require("../../services");
// var moment = require("moment");
const Sequelize = require("sequelize");
// const Op = Sequelize.Op;
// const privateKey = config.APP_URLS.PRIVATE_KEY_ADMIN;
// let TokenManager = require("../../helpers/adminTokenManager");
let message = require("../../config/messages");

module.exports = {
	getAlllisting: async(payloadData) => {      
		try {
			if (payloadData.skillId && typeof payloadData.skillId == "string") {
				payloadData.skillId = JSON.parse(payloadData.skillId);
			}
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				sortBy: Joi.string().optional(),
				orderBy: Joi.string().optional(),
				isBlocked: Joi.number().optional(),
				isDeleted: Joi.number().optional(),
				skillId: Joi.array().items(Joi.string()).optional(),
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				search: Joi.string().optional().allow(""),
			});
			// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
			// const fromDate =moment().subtract(7, "day").format("YYYY-MM-DD");
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id", "name", "email", "bio", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender", "serviceDisabled","veteranRelationDocumentLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "createdAt"
			];
			let sortBy = payload.sortBy ? payload.sortBy : "createdAt";
			let orderBy = payload.orderBy ? payload.orderBy : "DESC";
			let isBlocked = payload.isBlocked ? payload.isBlocked : "0";

			let users = await Services.AdminUserService.getAdminUserList(
				payload, projection, payload.limit || 50, payload.skip || 0,sortBy,orderBy,isBlocked
			);
			let TotalUser = await Services.AdminUserService.countData(payload);
			let blocked = await Services.AdminUserService.countDataBlocked(payload);
			let unBlocked = await Services.AdminUserService.countDataUnBlocked(payload);
			return {
				listing: users,
				TotalUser: TotalUser,
				Blocked: blocked,
				unBlocked: unBlocked

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
				userId: payload.id,
			};
			let projection = ["id", "name", "email", "bio", "pronounsType", "customPronouns", "dateOfBirth", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender", "serviceDisabled","veteranRelationDocumentLink","scoreLink","veteranRelationName","veteranRelationType", "personalityTest", "militaryJobTitle", "location", "linkedInLink", "profileImage", "authenticityDocumentLink", "zipCode", "latitude", "longitude", "dateOfBirth", "loginType", "userType", "isBlocked", "lastVisit", "createdAt",
				[Sequelize.literal("(SELECT (services.name) FROM services as services where users.serviceId = services.id)"), "Services"]
			];
			let result = {};
			result.detailUserDetails= await Services.AdminUserService.getUserDetail(criteria, projection);
			result.detailUserSkills= await Services.UserBuildResumeService.getSkills(criteria);
			result.detailUserEducations= await Services.UserBuildResumeService.getEducation(criteria);
			result.detailUserWorkExperience= await Services.UserBuildResumeService.getWorkExperience(criteria);
			result.detailProjectUndertaken= await Services.UserBuildResumeService.getProjectTaken(criteria);
			result.detailVolunteerExperience= await Services.UserBuildResumeService.getVolunteerExperience(criteria);
			result.awardHonors = await Services.UserBuildResumeService.getAwardsAndHonors(criteria);
			result.licenseCertification = await Services.UserBuildResumeService.getLicenseAndCertification(criteria);
			result.jobPreference = await Services.UserBuildResumeService.getJobPreference(criteria);
			result.language = await Services.UserBuildResumeService.getLanguage(criteria);
			result.userTourOfDuties= await Services.UserBuildResumeService.getUserTourOfDuties(criteria);

			return result;
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

			await Services.AdminUserService.updateData(criteria, objToSave);
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

			await Services.AdminUserService.updateData(criteria, objToSave);
			return message.success.UPDATED;
		}catch (err){
			console.log(err);
			throw err;
		}
	}
};