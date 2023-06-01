const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const Services = require("../../services");
const baseService =require("../../services/base");
const Models = require("../../models");
const Sequelize = require("sequelize");

module.exports = {
	homeOld: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				jobTitle: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let data={
				userId:payload.userId,
				isDeleted:0
			};
			console.log(data);
			let criteriaRecruiter = {
				isAdminApproved: "1", 
				userType: "SUPER_RECRUITER",
				isDeleted:0,
				isBlocked:0
			};
			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId", "payOption", "location","price","maximum", "minimum", "noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt",
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"]
			];
			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved"
			];
			let result= {};
			// let userDetail=await baseService.getSingleRecord(Models.UserWorkExperiences,data,["id","jobTitle"]);
			// const jobTitle = userDetail.jobTitle;
			// const jobTitleArray = jobTitle.split(" ");
			result.profileScore=50;
			result.countApplyJob= await Services.UserJobService.count(payload);
			result.countSaveJob= await Services.UserJobService.countJob(payload);
			// result.recommandJob=await Services.JobPostService.getRecommandedJob(data, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);

			result.recommandJob=await Services.JobPostService.getListings(
				payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			
			result.manufacturingJob=await Services.JobPostService.getListings(
				payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
			
			result.transportationJob=await Services.JobPostService.getListings(
				payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);  
			
			result.employersChoice = await Services.RecruiterService.getList(
				criteriaRecruiter, projectionRecruiter, payload.limit || 10, payload.skip || 0);
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},
	home: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				jobTitle: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let data={
				userId:payload.userId,
				isDeleted:0
			};
			let criteriaRecruiter = {
				isAdminApproved: "1", 
				userType: "SUPER_RECRUITER",
				isDeleted:0,
				isBlocked:0
			};
			let projectionUser = ["id", "name", "email", "bio",
				[Sequelize.literal(`(SELECT (isCreateProfile + isSkills + isEducation + isWorkExperiences + isVolunteerExperiences + isProjectUnderTaken + isAwardHonors + isCertification +isLanguages + isPreferences) * 10 as a FROM user_resume_status WHERE userId ="${payload.userId}" limit 1 )`), "sumOfScore"]
			];
			let userData = await Services.UserService.getDetail({ id: payload.userId }, projectionUser, true);
			let profileScore = 0;
			if (userData) {
				profileScore = userData.dataValues.sumOfScore;
			}

			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId", "payOption", "location","workPlaceLocation","price","maximum", "minimum", 
				"noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt","description",
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				// [Sequelize.literal(`(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "isApplied"],
				[Sequelize.literal(`
(CASE 
  WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1) > 0 
  THEN 1 
  ELSE 0 
END)
`),
				"isApplied"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"]
			];
			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved"
			];

			let projectionIndustries = ["id", "industryId", "isBlocked", "createdAt",
				[Sequelize.literal("(SELECT name FROM industries where id=user_job_preferences_industries.industryId limit 1 )"), "industriesName"]
			];
			let result= {};
		
			result.userDetail;
			result.profileScore=profileScore;
			result.jobRole = await Services.CategoriesService.getListingCategories(payload, 5, 0);
			result.countApplyJob= await Services.UserJobService.count(payload);
			result.countSaveJob= await Services.UserJobService.countJob(payload);

			//result.recommandJob=await Services.JobPostService.getRecommandedJob(data,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);

			result.recommandJob=await Services.JobPostService.getListings(payload, projection, 5, 0);
			let userIndustriestList =await Services.UserBuildResumeService.getUserJobPreferencesIndustries(projectionIndustries, data);
			Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isSteped: 12});
			let arr= [];
			userIndustriestList = await JSON.parse(JSON.stringify(userIndustriestList));
			await Promise.all(
				userIndustriestList.map(async (element) => {
					let objArr = {};
					objArr.title = element.industriesName;
					objArr.industryId = element.industryId;
					objArr.listing = await Services.JobPostService.getListings({industryId: element.industryId}, projection, 5, 0);
					arr.push(objArr);

				})
			);
			result.industriestList = arr;
			
			result.employersChoice = await Services.RecruiterService.getList(criteriaRecruiter, projectionRecruiter, 5, 0);
			return result;
		}
		catch (err){
			console.log(err);
			throw err;
		}

	},

	guestUser: async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				search: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let data={
				userId:payload.userId,
				isDeleted:0
			};
			let criteriaRecruiter = {
				isAdminApproved: "1", 
				userType: "SUPER_RECRUITER",
				isDeleted:0,
				isBlocked:0
			};

			let projectionUser = ["id", "name", "email", "bio",
				[Sequelize.literal(`(SELECT (isCreateProfile + isSkills + isEducation + isWorkExperiences + isVolunteerExperiences + isProjectUnderTaken + isAwardHonors + isCertification +isLanguages + isPreferences) * 10 as a FROM user_resume_status WHERE userId ="${payload.userId}" limit 1 )`), "sumOfScore"]
			];
			let userData = await Services.UserService.getDetail({ id: payload.userId }, projectionUser, true);
			let profileScore = 0;
			let result= {};
			if (userData) {
				profileScore = userData.dataValues.sumOfScore;
				result.profileScore=profileScore;
			}

			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId", "payOption", "location","workPlaceLocation","price","maximum", "minimum", "noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt","description",
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal(`
				(CASE 
				  WHEN (SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1) > 0 
				  THEN 1 
				  ELSE 0 
				END)
				`),
				"isApplied"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"]
			];
			let projectionRecruiter = ["id", "name", "email", "companyName", "description", "companySize", "websiteLink", "industry", "countryCode", "phoneNumber", "isEmailVerified", "isPhoneVerified",
				"gender",  "location", "linkedInLink", "profileImage", "zipCode", "latitude", "longitude", "dateOfBirth",  "isBlocked", "createdAt","isAdminApproved"
			];
			
			await baseService.getSingleRecord(Models.UserWorkExperiences,data,["id","jobTitle"]);

			result.jobRole = await Services.CategoriesService.getListingCategories(payload, 5, 0);
			result.latestJobs=await Services.JobPostService.getListings(payload, projection, 5, 0);
			result.countApplyJob= await Services.UserJobService.count(payload);
			result.countSaveJob= await Services.UserJobService.countJob(payload);
			Services.UserBuildResumeService.updateResumeStatus(Models.UserResumeStatus,{userId: payload.userId}, {isSteped: 12});

			let industriestList = [
				{
					title : "remote Jobs",
					id : "remote Jobs",
					listing: await Services.JobPostService.getListings(payload, projection, 5, 0)
				},
				{
					title : "IT Jobs",
					id : "remote Jobs",
					listing: await Services.JobPostService.getListings(payload, projection, 5, 0)
				}, 
				{
					title : "constructor Jobs",
					id : "remote Jobs",
					listing: await Services.JobPostService.getListings(payload, projection, 5, 0)
				}  
			];
			result.industriestList= industriestList;
			// result.remoteJobs=await Services.JobPostService.getListings(payload, projection, 5, 0);
			
			// result.ITJobs=await Services.JobPostService.getListings(payload, projection, 5, 0);
			
			// result.constructorJobs=await Services.JobPostService.getListings(payload, projection,5, 0);  
			
			result.employersChoice = await Services.RecruiterService.getList(criteriaRecruiter, projectionRecruiter, 5, 0);
			return result;
		}
		catch (err){
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
				minimum: Joi.number().optional().allow(""),
				maximum: Joi.number().optional().allow(""),
				rate: Joi.string().optional().allow(""),
				industryId: Joi.array().items().optional().allow(""),
				categoryId: Joi.array().optional().allow(""),
				location: Joi.string().optional().allow(""),
				jobTitle: Joi.string().optional().allow(""),
				benefitsId: Joi.array().optional().allow(""),
				userId:Joi.string().optional(),
				latitude:Joi.string().optional(),
				longitude:Joi.string().optional(),
				jobEligibleForId:Joi.array().optional(),
				travelRequirementId:Joi.array().optional(),
				personalitiesIds: Joi.array().optional(),
				scheduleId:Joi.array().optional(),
				workPlaceLocation:Joi.array().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id","jobTitle", "recuiterId", "categoryId", "industryId", "payOption","travelRequirementId","jobEligibleForId","scheduleId","workPlaceLocation", "location","price","maximum", "minimum", "noOfPeopleRequired", "countryCode", "phoneNumber", "rate", "createdAt",
				[Sequelize.literal("(SELECT count(id) FROM user_job_apply where jobPostId=job_posts.id and isDeleted=0 limit 1)"), "applicantsCount"],
				[Sequelize.literal(`(SELECT count(id) FROM user_job_post_save where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1)`), "saveStatus"],
				[Sequelize.literal("(SELECT 0)"), "isfeatured"],
				[Sequelize.literal(`(SELECT if(count(id)>0,1,0) FROM user_job_apply where jobPostId=job_posts.id and userId = '${payload.userId}' limit 1 )`), "isApplied"]
			];
			// [Sequelize.literal(`(SELECT  (((acos(sin((${payload.latitude}*pi()/180)) * sin((job_posts.latitude*pi()/180))+ cos((${payload.latitude}*pi()/180)) * cos((job_posts.latitude*pi()/180)) *cos(((${payload.longitude} - job_posts.longitude)*pi()/180)))) * 180/pi())* 60 * 1.1515) )`), "distance"],
		
			let count=await Services.JobPostService.count(payload);
			let result = await Services.JobPostService.getAppListing(
				payload, projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
           
			return {count:count,listing: result};
		}
		catch (err){
			console.log(err);
			throw err;
		}
	}
};