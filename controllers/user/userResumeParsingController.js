const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const response = require("../../config/response");
const Services = require("../../services");
const env = require("../../config/env")();
const Models = require("../../models");
const aws = require("aws-sdk");
var https = require("https");
const s3 = new aws.S3({});

aws.config.update({
	secretAccessKey: env.AWS.accessKeyId,
	accessKeyId: env.AWS.secretAccessKey,
	region: env.AWS.awsRegion,
});
let S3_BUCKET = env.AWS.S3.bucket;

module.exports = {
	resumeParsingData: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				tokenId: Joi.string().required(),
				resumeName: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let userId = payload.tokenId;
			let filePath = "users/"+payload.resumeName;
			let fileName = payload.resumeName;
			// let resume = filePath+fileName;
			// console.log(resume, "resume");
			// let FILE_DATA= await base64_encode(resume);
			// console.log(FILE_DATA, "FILE_DATA");
			var params = { Bucket: S3_BUCKET, Key: filePath };
			let S3_FILE_DATA = (await readS3File(params)).Body;
			let FILE_DATA = new Buffer(S3_FILE_DATA).toString("base64");

			let jsonObject = JSON.stringify({
				"filedata":FILE_DATA,
				"filename":fileName,
				"userkey":"AAZ415JC",
				"version":"8.0.0",
				"subuserid":"Rajeev Sharma"
			});
			var postHeaders = {
				"Content-Type" : "application/json",
				"Content-Length" : Buffer.byteLength(jsonObject, "utf8")
			};
			var optionsPost = {
				host : "rest.rchilli.com",
				port : 443,
				path : "/RChilliParser/Rchilli/parseResumeBinary",
				method : "POST",
				headers : postHeaders
			};
			let resumeData = await parseResume(optionsPost, jsonObject);
			if (resumeData && resumeData !==undefined) {
				resumeData = resumeData.ResumeParserData;
				let SegregatedSkill = [];
				let SegregatedQualification = [];
				let SegregatedExperience = [];
				let SegregatedAchievement = [];
				let SegregatedCertification = [];
				let ResumeLanguage = {};
				let Achievements = "";
				SegregatedSkill = resumeData?.SegregatedSkill || [];
				SegregatedQualification = resumeData?.SegregatedQualification || [];
				SegregatedExperience = resumeData?.SegregatedExperience || [];
				SegregatedAchievement = resumeData?.SegregatedAchievement || [];
				SegregatedCertification = resumeData?.SegregatedCertification || [];
				Achievements = resumeData?.Achievements || "";
				ResumeLanguage = resumeData?.ResumeLanguage || "";

				if (SegregatedSkill !== undefined && SegregatedSkill.length > 0) {
					await addUserSkills(SegregatedSkill, userId);
				}

				if (SegregatedQualification !== undefined && SegregatedQualification.length > 0) {
					await addUserSegregatedQualification(SegregatedQualification, userId);
				}

				if (SegregatedExperience !== undefined && SegregatedExperience.length > 0) {
					await addUserSegregatedExperience(SegregatedExperience, userId);
				}

				if (SegregatedExperience !== undefined && SegregatedExperience.length > 0) {
					await addUserProjectsUndertaken(SegregatedExperience, userId);
				}
				if (SegregatedCertification !== undefined && SegregatedCertification.length > 0) {
					// //await addUserSegregatedCertification(SegregatedCertification, userId);
				}
				if (ResumeLanguage !== undefined) {
					await addUserResumeLanguage(ResumeLanguage, userId);
				}
				if (SegregatedAchievement !== undefined && SegregatedAchievement.length > 0) {
					// //await addUserSegregatedAchievement(SegregatedAchievement, userId);
				}else{
					if (Achievements !=="" && Achievements !==undefined) {
						await addUserAchievements(Achievements, userId);
					}
				}
				return response.STATUS_MSG.SUCCESS.DEFAULT;
			} else {
				throw response.error_msg.RCHILLI_DATA_ERROR;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
};

/*let  base64_encode = async(documentFile) => {
	try{
		var documentFileBinaryData = fs.readFileSync(documentFile);
		return new Buffer(documentFileBinaryData).toString("base64");
	}catch (err) {
		console.log(err);
		throw err;
	}
};*/

let readS3File = (params) => {
	try{
		return new Promise((resolve, reject) => {
			s3.getObject(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}catch (err) {
		console.log(err);
		throw err;
	}
};

let parseResume = async (optionsPost, jsonObject) => {
	try {
		return new Promise((resolve, reject) => {
			var reqPost = https.request(optionsPost, function(res) {
				// console.log("statusCode: ", res.statusCode);
				var chunks = [];
				res.on("data", function (chunk) {
					chunks.push(chunk);
				});
				res.on("end", function () {
					var body = Buffer.concat(chunks);
					body    =   JSON.parse(body);
					// console.log(body, "body")
					resolve(body);
					// console.log(body.toString());
				});

				res.on("error", function (error) {
					console.error(error);
					reject(error);
				});
			});
			// write the json data
			reqPost.write(jsonObject);
			reqPost.end();
			reqPost.on("error", function(e) {
				reject(e);
			});
		});
	} catch (err){
		console.log(err, "===>>");
		throw err;
	}
};

let addUserSkills = async(data, userId) => {
	try {
		if (data.length > 0) {
			await Services.UserBuildResumeService.deleteRecords(Models.UserSkills, {userId : userId});
			await Promise.all(
				data.slice(0, 10).map(async (element) => {
					let Alias = element.Alias;
					if (Alias !== undefined && Alias.length > 100){
						let Skill = element.Skill;
						let arrSkills = Alias.split(",");
						const trimArray = arrSkills.map(element => {
							return element.trim();
						});
						trimArray.push(Skill);
						let skillDetails =await Services.SkillsService.checkUserSkells(trimArray);
						if (skillDetails) {
							await Services.UserBuildResumeService.saveSkills({userId : userId, skillId : skillDetails.id });
						}else{
							// if (!skillDetails) {
							if (Skill !== null) {
								let saveData = await Services.SkillsService.saveData({name : Skill});
								await Services.UserBuildResumeService.saveSkills({userId : userId, skillId : saveData.id });
							}
							// }
							
						}
						// console.log(arrSkills, "arrSkills")	
					}
				})
			);
		}
		return true;		
	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};

let addUserSegregatedQualification = async(data, userId) => {
	try{
		if (data.length > 0) {
			for await (const element of data) {
				let InstitutionName = element.Institution.Name ? element.Institution.Name.trim() :""; 
				let DegreeName = element.Degree.DegreeName ? element.Degree.DegreeName.trim() : ""; 
				let StartDate = element.Degree.StartDate; 
				let EndDate = element.Degree.EndDate;
				let detailUniversity = await Services.UniversityService.countUniversities({name:InstitutionName});
				let detailSpecialzation = await Services.SpecializationService.getOne({name:DegreeName});
				let objToSave = {};
				objToSave.userId = userId;
				if (detailUniversity !==0) {
					objToSave.universityId = detailUniversity.id;
					// await Services.UniversityService.saveData({name:InstitutionName});

				}else{
					let createUniversity = await Services.UniversityService.saveData({name:InstitutionName});
					objToSave.universityId = createUniversity.id;
				}
				if (detailSpecialzation) {
					objToSave.specializationId = detailSpecialzation.id;
				}else{
					let createSpecialzation = await Services.SpecializationService.saveData({name:DegreeName});
					objToSave.specializationId = createSpecialzation.id;
				}
				if (StartDate !==undefined && StartDate !="") {
					objToSave.fromDate= StartDate;
				}
				if (EndDate !==undefined && EndDate !=="") {
					objToSave.toDate= EndDate;
				}
				await Services.UserBuildResumeService.saveEducation(objToSave); 
			}	          		
		}
		return true;

	}catch (err){
		console.log(err, "===>>");
		throw err;
	}

};

let addUserSegregatedExperience = async(data, userId)=> {
	try{
		if(data.length > 0) {
			await Promise.all(
				data.map(async (element) => {
					let JobProfile =element.JobProfile;
					let Employer =element.Employer;
					let Location =element.Location;
					let StartDate =element.StartDate;
					let EndDate =element.EndDate;
					// console.log(JobProfile, "JobProfile")
					let objToSave = {};
					objToSave.userId = userId;
					if (_.has(JobProfile, "Title") && JobProfile.Title != "") objToSave.jobTitle = JobProfile.Title; 
					if (_.has(Employer, "EmployerName") && Employer.EmployerName != "") objToSave.companyName = Employer.EmployerName; 
					if (_.has(Location, "State") && Location.State != "") objToSave.location = Location.State; 
								
					objToSave.fromDate = StartDate; 
					objToSave.toDate = EndDate;
					await Services.UserBuildResumeService.saveWorkExperience(objToSave);
				})
			);
		}
		return true;

	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};
let addUserProjectsUndertaken = async(data, userId)=> {
	try{
		console.log("case5");
		if(data.length > 0) {
			await Promise.all(
				data.map(async (element) => {
					let JobProfile =element.JobProfile;
					let Projects =element.Projects;
					// let Employer =element.Employer;
					// let Location =element.Location;
					// let StartDate =element.StartDate;
					// let EndDate =element.EndDate;
					let IsCurrentEmployer =element.IsCurrentEmployer;
					// console.log(JobProfile, "JobProfile")
					let objToSave = {};
					if(Projects){
						if (Projects[0].ProjectName !=="" && Projects[0].ProjectName !== undefined) {
							objToSave.userId = userId;
							if (_.has(JobProfile, "Title") && JobProfile.Title != "") objToSave.jobTitle = JobProfile.Title; 
							// if (_.has(Employer, "EmployerName") && Employer.EmployerName != "") objToSave.companyName = Employer.EmployerName; 
							// if (_.has(Location, "State") && Location.State != "") objToSave.location = Location.State; 
							objToSave.projectTitle =Projects.ProjectName;
							if (IsCurrentEmployer && IsCurrentEmployer ===true) {
								objToSave.isCurrentlyOngoing = 1;
							}	
							// objToSave.fromDate = StartDate; 
							// objToSave.toDate = EndDate;
							// console.log(objToSave, "objToSave");
							await Services.UserBuildResumeService.saveProjectTaken(objToSave);
						}
					}
				})
			);
		}
		return true;
	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};

/*let addUserSegregatedAchievement = async(data, userId) =>{
	try{
		if(data.length > 0) {
			console.log(userId, "===>>");
		}
		return true;
	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};
let addUserSegregatedCertification = async(data, userId) =>{
	try{
		if(data.length > 0) {
			console.log(userId, "===>>");
		}
		return true;
	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};*/
let addUserAchievements = async(data, userId) =>{
	try{
		// console.log(data, ">>>>>>>>>>>>>")
		if(data){
			let objToSave = {};
			objToSave.name = data;
			objToSave.userId = userId;
			await Services.UserBuildResumeService.saveAwardsAndHonors(objToSave);
		}
		
		return true;
	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};
let addUserResumeLanguage = async(data, userId) =>{
	try{
		console.log(data, "data");
		if(data){
			let objToSave = {};
			objToSave.language = data.Language;
			objToSave.userId = userId;
			objToSave.proficiency = "Write and read";
			await Services.UserBuildResumeService.saveLanguage(objToSave);
		}
		
		return true;
	}catch (err){
		console.log(err, "===>>");
		throw err;
	}
};