// const _ = require("underscore");
const Joi = require("joi");
const AWS = require("aws-sdk");
const env = require("../../config/env")();
const commonHelper = require("../../helpers/common");
const Services = require("../../services");
var fs = require("fs");
//var pdf = require("html-pdf");
AWS.config.update({
	accessKeyId: env.AWS.accessKeyId,
	secretAccessKey: env.AWS.secretAccessKey,
	region: env.AWS.awsRegion
});
const s3 = new AWS.S3();
const S3Bucket = env.AWS.S3.bucket;
let sendSecondaryTasks = require("../../helpers/pushToSecondarySQS");
let Constant = require("../../config/appConstants");
//const { Service } = require("aws-sdk");
module.exports = {
	downloadResumeOld: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				templateSample: Joi.string().required(),
				templateFormate: Joi.string().required(),
			});
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
			let downloadSample	=await downloadSample1(result);
			var fileNameDoc = Math.floor(Date.now() / 1000) +"_sample"+ ".docx";
			var fileNamePdf = Math.floor(Date.now() / 1000) +"_sample"+ "resume.pdf";
			let pathFolder = "./public/stylesheet/" + fileNameDoc;
			if (payload.templateFormate ==="docx") {
				const fileBuffer = await HTMLtoDOCX(downloadSample, null, {
					table: { row: { cantSplit: true } },
					footer: true,
					pageNumber: true,
				});

				fs.writeFile(pathFolder, fileBuffer, (error) => {
					if (error) {
						console.log("Doc file creation failed");
						return;
					}
					console.log("Doc file created successfully");
				});
			} else {
				let options = { "height": "16in", "width": "10in"};
				pdf.create(downloadSample, options).toStream(function(err, stream){
					stream.pipe(fs.createWriteStream(fileNamePdf));
					var params = {
						Bucket: S3Bucket,
						Body: stream,
						Key: "download" + "/" + fileNamePdf,
						ContentType: "application/pdf"
					};
					s3.upload(params, (err, data) => {
						console.log("err---", err);
						if (err){
							console.log("err---", err);
						}else {
							console.log(data, "data");
						}
					});
				});
			}
			return true;
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	downloadResume:  async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				templateSample: Joi.string().required(),
				templateFormate: Joi.string().required(),
			});
			let projectionUser = ["id", "name", "email", "downloadUrl"]; 
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let uploadPdf = await sendSecondaryTasks.sendMessage(Constant.APP_CONSTANTS.SECONDARY_ACTIONS.NOTIFICATIONS, "htmlToPdf", payload);
			let userData = await Services.UserService.getDetail({id:payload.userId}, projectionUser);
			let downloadUrl = userData.downloadUrl;
			return {url :downloadUrl};
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	downloadResume_Backup: async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				templateSample: Joi.string().required(),
				templateFormate: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			console.log(payload, "payload");

			let result= {};
			/*result.userProfile = await Services.UserBuildResumeService.getUser(payload);
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
			result.userTourOfDuties= await Services.UserBuildResumeService.getUserTourOfDuties(payload);*/
            
			// let downloadSample;
			// if (payload.templateSample === "1") {
			// 	downloadSample = await downloadSample1(result);
			// } else if (payload.templateSample === "2") {
			// 	downloadSample = await downloadSample2(result);
			// } else if (payload.templateSample === "3") {
			// 	downloadSample = await downloadSample3(result);
			// }
			// var resumeName = result.userProfile.dataValues.name;
			// var fileNameDoc = Math.floor(Date.now() / 1000) +"_sample"+ ".docx";
			// var fileNamePdf = Math.floor(Date.now() / 1000) +"_"+resumeName+"_"+ "resume.pdf";
			// let pathFolder = "./public/stylesheet/" + fileNameDoc;
			// console.log(pathFolder);
			// let createPdf  = await htmlToPdffile(downloadSample, fileNamePdf);
			// console.log(downloadSample, "downloadSample")
			await sendSecondaryTasks.sendMessage(Constant.APP_CONSTANTS.SECONDARY_ACTIONS.NOTIFICATIONS, "htmlToPdf", payload);
			// var params = {
			// 	Bucket: S3Bucket,
			// 	Body: createPdf,
			// 	Key: "download" + "/" + fileNamePdf,
			// 	ContentType: "application/pdf"
			// };
			// let uploadS3 =await s3.upload(params).promise();
			// return {url : uploadS3.Location};
			return result;
		}catch (err){
			console.log(err);
			throw err;
		}
	}
};

// let htmlToPdffile = async(downloadSample, fileNamePdf) => {
// 	console.log("payload------htmlToPdf", downloadSample);
// 	let pdfFile = fileNamePdf;
// 	console.log("pdfFile====>",pdfFile);
// 	let options = { "height": "16in", "width": "10in"};
// 	// let htmlCode = await EmailTemplates.invoice(payload.htmlData);

// 	return await s3.upload({
// 		Bucket: S3Bucket,
// 		Body: await generatePdf(downloadSample,options),
// 		Key: "download" + "/" + pdfFile,
// 		ContentType: "application/pdf",
// 	},async (err, res) => {
// 		console.log("inside s3 upload----");
// 		if (err) {
// 			console.log("err-- s3 upload", err);
// 			throw err;
// 		}
// 		let downloadUrl = res.Location;

	
// 		console.log("downloadUrl---", downloadUrl);
	
// 	});
// };
// let generatePdf = (downloadSample, options) => {
// 	return new Promise((resolve, reject) => {
// 		pdf.create(downloadSample, options).toStream(async(err, res) => {
// 			if (err) {
// 				console.log("err---", err);
// 				reject(err);
// 			}
// 			else {
// 				console.log("stream res---");
// 				resolve(res);
// 			}
// 		});
// 	});
// };



// let htmlToPdffile = async(data, fileNamePdf) =>{
// 	try{
// 		let options = { "height": "16in", "width": "10in"};
// 		return new Promise((resolve, reject) => {
// 			pdf.create(data, options).toStream(function(err, stream){
// 				// stream.pipe(fs.createWriteStream(fileNamePdf));
// 				if (err) {reject(err);}
// 				else {
// 					resolve(stream);
// 				}
// 			});
// 		});
// 	}catch (err){
// 		console.log(err);
// 		throw err;
// 	}
// };

let downloadSample1 = async (result)=> {
	
	const skills = result.skills;
	const awards = result.awardsAndHonors;
	const license = result.licenseAndCeritifcations;
	const languages = result.languages;
	const educations = result.educations; 
	const workExperiences = result.workExperiences; 
	const volunteerExperiences = result.volunteerExperiences;
	const userProfile = result.userProfile;
	const jobPreference = result.jobPreferences;
	const projects = result.projects;


	try {
		var sample1 = 
        `<!DOCTYPE html>
        <html style="height:100%;">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width"/>
            <title> Sample 1 </title>
            
        </head>
        
        <body style="margin:0px; padding:0px; height:100%; " >
            <table style="vertical-align:top; font-family:Arial, Helvetica, sans-serif; background: #585c68; font-size: 14px; line-height: 22px; color: #555555; " width="100%" height="100%" border="0" cellspacing="20" cellpadding="0">
                <tr>
                    <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="overflow-x: hidden; border-collapse: collapse; max-width:800px; background:#fff; width:100%; margin:0 auto;padding:0;box-sizing:border-box;border-collapse:collapse;  border: 1px solid #D3D4DC;" >
                               <tr>
                               <td align="center" valign="top" style=" width:30%; margin:0px; text-align:left; box-sizing:border-box;">
                                    <table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;">
                                        <tr>
                                            <td style="padding:0px;"> <img src="https://honorvet-dev.s3.amazonaws.com/users/${userProfile.dataValues.profileImage || "profileImages.jpg"}" width="280px"> </td>
                                        </tr>
                                    </table>
        
                                    <table cellspacing="0" cellpadding="0" style=" background: #0bb5f4; width:100%; margin:0px; text-align:left; padding:40px 30px; box-sizing:border-box; border-bottom: 2px solid #b1eaff;">
                                        <tr>
                                            <td style="padding: 0px;">   
                                                <h6 style="margin:0px; padding-bottom:5px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #fff;">${userProfile.dataValues.name === null ? "": userProfile.dataValues.name} </h6>
    
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #b1eaff; font-weight:normal; padding-bottom:20px;letter-spacing: 0.5px;"><img src="address.png" width="25px;" style="display: inline-block; vertical-align: middle; padding-right:10px;">${userProfile.dataValues.location ===null ? "" : userProfile.dataValues.location}</p>
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #b1eaff; font-weight:normal; padding-bottom:20px;letter-spacing: 0.5px;"><img src="mobile.png" width="25px;" style="display: inline-block; vertical-align: middle; padding-right:10px;">${userProfile.dataValues.phoneNumber === null ? "" : userProfile.dataValues.phoneNumber}</p>
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #b1eaff; font-weight:normal; padding-bottom:20px;letter-spacing: 0.5px;"><img src="email.png" width="25px;" style="display: inline-block; vertical-align: middle; padding-right:10px;">${userProfile.dataValues.email === null ? "" : userProfile.dataValues.email}</p>
                                            </td>
                                        </tr>
                                    </table>
        
                                    <table cellspacing="0" cellpadding="0" style=" background: #0bb5f4; width:100%; margin:0px; text-align:left; padding:40px 30px; box-sizing:border-box; border-bottom: 2px solid #b1eaff;">
                                        <tr>
                                            <td style="padding: 0px;">   
                                                <h6 style="margin:0px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #fff;"> SKILL'S </h6>
                                                ${skills.map((skills) => {
		return`
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #b1eaff; font-weight:normal; padding-bottom:20px;letter-spacing: 0.5px;"> ${skills.dataValues.skillDetails.name}</p>
                                                `;}).join("")}

                                            </td>
                                        </tr>
                                    </table>
        
                                    <table cellspacing="0" cellpadding="0" style=" background: #0bb5f4; width:100%;  margin:0px; text-align:left; padding:40px 30px; box-sizing:border-box; border-bottom: 2px solid #b1eaff;">
                                        <tr>
                                            <td style="padding: 0px;">   
                                                <h6 style="margin:0px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #fff;"> SOCIAL </h6>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; padding-left:30px; color: #b1eaff; font-weight:normal; padding-bottom:20px;letter-spacing: 0.5px;">${userProfile.dataValues.linkedInLink === null ? "" :userProfile.dataValues.linkedInLink}</p>

                                                <p style="margin:0px; word-break: break-all;font-size: 14px; padding-left:30px; color: #b1eaff; font-weight:normal; padding-bottom:20px;letter-spacing: 0.5px;">${userProfile.dataValues.facebookId === null ? "": userProfile.dataValues.facebookId}</p>

                                            </td>
                                        </tr>
                                    </table>
        
                                    <table cellspacing="0" cellpadding="0" style=" background: #0bb5f4; width:100%; margin:0px; text-align:left; padding:40px 30px; box-sizing:border-box; border-bottom: 2px solid #b1eaff;">
                                        <tr>
                                            <td style="padding: 0px; height: 2000px">           
                                            </td>
                                        </tr>
                                    </table>
        
                                </td>
        
                                <td align="left" valign="top" style=" width:70%; margin:0px; text-align:left; padding:30px 30px; box-sizing:border-box;">
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff;">
                                        <tr>
                                            <td style="padding: 0px;"> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> About us </h6>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:20px;"> ${userProfile.dataValues.bio === null ? "" : userProfile.dataValues.bio} </p>
                                            </td>
                                        </tr>
                                    </table>
        
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> WORK EXPERIENCE </h6>
                                                ${workExperiences.map((workExperiences) => {
		const fromDate = workExperiences.dataValues.fromDate ? new Date(workExperiences.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = workExperiences.dataValues.toDate ? new Date(workExperiences.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return`
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; font-weight:600; padding-bottom:5px;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span> ${formattedFromDate === null ? "" : formattedFromDate} - ${formattedToDate === null?"" : formattedToDate}</p>
        
                                                <p style="margin:0px; word-break: break-all;padding-left: 20px; font-size: 14px; color: #333; padding-bottom:5px; font-weight: 600;"> ${workExperiences.dataValues.companyName === null ? "" : workExperiences.dataValues.companyName} </p>
                                                <p style="margin:0px; word-break: break-all;padding-left: 20px; font-size: 14px; color: #333; padding-bottom:30px;"> ${workExperiences.dataValues.description===null ? "": workExperiences.dataValues.description}</p>

                                                `;}).join("")}
                                            </td>
                                        </tr>
                                    </table>
        
        
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> EDUCATION </h6>
                                                ${educations.map((education) => {
		const fromDate = education.dataValues.fromDate ? new Date(education.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = education.dataValues.toDate ? new Date(education.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return `
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;font-weight: 600; padding-bottom:5px;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span>${formattedFromDate === null ?"": formattedFromDate} - ${formattedToDate === null ?"":formattedToDate}</p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;">${education.dataValues.universityDetails=== null ? "" : education.dataValues.universityDetails.name} </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;">${education.dataValues.specializationDetails=== null ? "" : education.dataValues.specializationDetails.name} </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;">${education.dataValues.description===null?"":education.dataValues.description}</p>
                                                `;}).join("")}
        
                                            </td>
                                        </tr>
                                    </table>
        
                                    
        
                                    <!-- PROJECTS UNDERTAKEN  -->
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> PROJECTS UNDERTAKEN </h6>
                                                ${projects.map((projects) => {
		const fromDate = projects.dataValues.fromDate ? new Date(projects.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = projects.dataValues.toDate ? new Date(projects.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		const projectLinks = projects.dataValues.projectLinksDetails;
		return `
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;font-weight: 600; padding-bottom:5px;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span>${formattedFromDate===null?"":formattedFromDate} - ${formattedToDate===null?"":formattedToDate} </p>
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;">${projects.dataValues.projectTitle==null?"":projects.dataValues.projectTitle}</p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px;">${projects.dataValues.description===null?"":projects.dataValues.description} </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;">
                                                ${projectLinks.map(link => `<a href="${link.link}" style="font-size: 14px; color: #0bb5f4;">${link.link}</a>`).join("<br>")}
                                                `;}).join("")}
        
        
                                            </td>
                                        </tr>
                                    </table>
        
                                    <!-- AWARDS & HONORS -->
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> AWARDS & HONORS </h6>
                                                ${awards.map((award) => {
		const issuesedOn = award.dataValues.issuesedOn ? new Date(award.dataValues.issuesedOn) : null;
		const issuesedDate = issuesedOn ? issuesedOn.toLocaleDateString() : "";
		return`
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;font-weight: 600;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span> ${issuesedDate === null ? "" : issuesedDate} </p>
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;">${award.dataValues.name === null?"":award.dataValues.name} </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;">${award.dataValues.description === null ? "":award.dataValues.description} </p>
                                                `;}).join("")}
                                                
        
                                            </td>
                                        </tr>
                                    </table>
        
                                    <!-- LICENSES & CERTIFICATIONS  -->
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> LICENSES & CERTIFICATIONS </h6>
                                                ${license.map((license) =>{
		const issuesedOn = license.dataValues.issuesedOn ? new Date(license.dataValues.issuesedOn) : null;
		const formatIssuesedOnDate = issuesedOn ? issuesedOn.toLocaleDateString() : "";
		const expirydate = license.dataValues.expirydate ? new Date(license.dataValues.expirydate) : null;
		const formatExpiryDate = expirydate ? expirydate.toLocaleDateString() : "";
		return`
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;font-weight: 600; padding-bottom:5px;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span>${formatIssuesedOnDate === null ? "" : formatIssuesedOnDate} - ${formatExpiryDate === null ? "" : formatExpiryDate}  </p>
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;">${license.dataValues.name === null ? "":license.dataValues.name}</</p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;"> ${license.dataValues.description === null ? "": license.dataValues.description} </p>
                                                `;}).join("")}
                                                
        
                                            </td>
                                        </tr>
                                    </table>
        
                                    <!-- LANGUAGES -->
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> LANGUAGES </h6>
                                                ${languages.map((language) =>{ 
		return`
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;"> <span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span>${language.dataValues.language===null?"":language.dataValues.language}</p>
                                                `;}).join("")}
                                            </td>
                                        </tr>
                                    </table>
        
                                    <!-- VOLUNTEER EXPERIENCE -->
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; border-bottom: 2px solid #b1eaff; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> VOLUNTEER EXPERIENCE </h6>
                                                ${volunteerExperiences.map((volunteerExperiences) => {
		const fromDate = volunteerExperiences.dataValues.fromDate ? new Date(volunteerExperiences.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = volunteerExperiences.dataValues.toDate ? new Date(volunteerExperiences.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return`
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;font-weight: 600; padding-bottom:5px;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span>${formattedFromDate === null ?"":formattedFromDate} - ${formattedToDate===null ?"":formattedToDate} </p>
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:5px; font-weight: 600;"> ${volunteerExperiences.dataValues.organization ===null ?"":volunteerExperiences.dataValues.organization} </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;">${volunteerExperiences.dataValues.description===null ?"":volunteerExperiences.dataValues.description} </p>

                                                `;}).join("")}
                                            </td>
                                        </tr>
                                    </table>
        
                                    <!-- JOB PREFERENCES -->
                                    <table cellspacing="0" cellpadding="0" style=" width:100%; padding: 20px 0px;">
                                        <tr>
                                            <td> 
                                                <h6 style="margin:0px;padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 20px; text-transform: uppercase; color: #0bb5f4;"> JOB PREFERENCES </h6>
                                                ${jobPreference.map((jobPreference) =>{
		const jobIndustries = jobPreference.dataValues.jobPreferenceIndustriesDetails;
		return `
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-bottom:5px; font-weight: 600;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span> Industry </p>
                                                ${jobIndustries.map(jobs => `<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-left: 20px;  padding-bottom:30px;">${jobs.industryDetails.name}</p>`).join("")}
                                                
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px; font-weight: 600;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span> Desired salary </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;">${jobPreference.dataValues.desiredSalaryCurrency===null?"":jobPreference.dataValues.desiredSalaryCurrency} ${jobPreference.dataValues.desiredSalary===null?"":jobPreference.dataValues.desiredSalary} ${jobPreference.dataValues.desiredSalaryType===null ?"":jobPreference.dataValues.desiredSalaryType} </p>
    
        
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px; font-weight: 600;"><span style="display: inline-block; padding-right: 10px;"><img src="https://honorvet-dev.s3.amazonaws.com/users/profileImages.jpg" width="8px;"></span> Are you vaccinated </p>
                                                <p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-left: 20px; padding-bottom:30px;">${jobPreference.dataValues.covidVaccinated == 0 ? "No": "Yes"}</p>
                                                `;}).join("")}
                                                
                                            </td>
                                        </tr>
                                    </table>
        
                                </td>
                               </tr>
        
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;
		return sample1;
	}catch (err){
		console.log(err);
		throw err;
	}
};

let downloadSample2 = async (result)=> {
	const skills = result.skills;
	const awards = result.awardsAndHonors;
	const license = result.licenseAndCeritifcations;
	const languages = result.languages;
	const educations = result.educations; 
	const workExperiences = result.workExperiences; 
	const volunteerExperiences = result.volunteerExperiences;
	const userProfile = result.userProfile;
	const jobPreference = result.jobPreferences;
	const projects = result.projects;


	try {
		var sample2 = 
        `<!DOCTYPE html>
<html style="height:100%;">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width"/>
	<title> Resume 2 </title>
	
</head>

<body style="margin:0px; padding:0px; " >
	<table style="vertical-align:top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 22px; color: #555555; " width="100%" height="100%" border="0" cellspacing="20" cellpadding="0">
		<tr>
			<td>
				<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="overflow-x: hidden; border-collapse: collapse;  background:#fff; width:100%; margin:0 auto;padding:0;box-sizing:border-box; border-collapse:collapse; " >
				   	<tr>
				   		<td align="center" valign="top" style=" border-right: 1px solid rgba(0,0,0,.05); height: 100%;  position: fixed; width: 30%;">
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:200px 0px;">
								<tr>
									<td align="center" style="padding:0px;">
									
									 	<img src="https://honorvet-dev.s3.amazonaws.com/users/${userProfile.dataValues.profileImage || "profileImages.jpg"}" width="150px" style="border-radius:100%;">
									 	<p style="margin:0px; word-break: break-all;font-size: 25px; color: #333; padding:20px 0px; font-weight: 600;"><strong>${userProfile.dataValues.name === null ? "" : userProfile.dataValues.name}</strong></p>
									 	<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;">${userProfile.dataValues.location === null ? "" : userProfile.dataValues.location}</p>
									 	<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;">${userProfile.dataValues.email === null ? "" : userProfile.dataValues.email}</p>
									 	<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;">${userProfile.dataValues.phoneNumber ===null? "": userProfile.dataValues.phoneNumber}</p>
									</td>
								</tr>
							</table>
						</td>

						<td align="right" valign="top" style=" width: 70%;  padding: 50px 100px;">

							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 40px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:30px; font-weight: 700; font-size: 22px; color: #333;"> Work Experience </h6>
                                        ${workExperiences.map((workExperiences) => {
		const fromDate = workExperiences.dataValues.fromDate ? new Date(workExperiences.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = workExperiences.dataValues.toDate ? new Date(workExperiences.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return`

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:15px;">${formattedFromDate === null ? "" : formattedFromDate} - ${formattedToDate === null ? "" : formattedFromDate}<span style="margin:0px; font-size: 18px; color: #000; "> ${workExperiences.dataValues.companyName === null ? "" : workExperiences.dataValues.companyName} | ${workExperiences.dataValues.jobTitle === null ? "" : workExperiences.dataValues.jobTitle }</span> </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:15px;"> ${workExperiences.dataValues.description === null ? "" : workExperiences.dataValues.description}</p>
                                        `;}).join("")}
									 </td>
								</tr>
							</table>

							<!-- Skills -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 50px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Skills </h6>
                                        ${skills.map((skills) =>{ 
		return`
										<span style="background: rgba(0,0,0,.75); border-radius: 5px; color: #FFF; display: inline-block; list-style: none; margin: 15px 15px 0 0; padding: 10px; text-align: justify; cursor: pointer; font-size: 18px; letter-spacing: 0.5px;">${skills.dataValues.skillDetails.name}</span>
                                        `;}).join("")}

									 </td>
								</tr>
							</table>


							<!-- Education  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:30px; font-weight: 700; font-size: 22px; color: #333;"> Education </h6>
                                        ${educations.map((education) => {
		const fromDate = education.dataValues.fromDate ? new Date(education.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = education.dataValues.toDate ? new Date(education.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return `

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formattedFromDate === null ? "" : formattedFromDate} - ${formattedToDate === null ? "" : formattedFromDate}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${education.dataValues.universityDetails=== null ? "" : education.dataValues.universityDetails.name} </p>
										<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333;  padding-bottom:5px; font-weight: 600;">${education.dataValues.specializationDetails=== null ? "" : education.dataValues.specializationDetails.name} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${education.dataValues.description === null ? "" : education.dataValues.description}</p>
                                        `;}).join("")}

									 </td>
								</tr>
							</table>


							<!-- Project Undertaken  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Project Undertaken </h6>
                                        ${projects.map((projects) => {
		const fromDate = projects.dataValues.fromDate ? new Date(projects.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = projects.dataValues.toDate ? new Date(projects.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		const projectLinks = projects.dataValues.projectLinksDetails;
		return `

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formattedFromDate === null ? "" : formattedFromDate} - ${formattedToDate === null ? "" : formattedToDate} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${projects.dataValues.projectTitle === null ? "" : projects.dataValues.projectTitle}</p>
										<p style="margin:0px; word-break: break-all;word-break: break-all; font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${projects.dataValues.description===null ? "" : projects.dataValues.description}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">

                                        ${projectLinks.map(link => `<a href="${link.link}" style="margin:0px; font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px;"> ${link.link}</</a>`).join("<br>")}</p>
                                        `;}).join("")}
									 </td>
								</tr>
							</table>


							<!-- Awards & honors  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Awards & honors </h6>

                                        ${awards.map((award) => {
		const issuesedOn = award.dataValues.issuesedOn ? new Date(award.dataValues.issuesedOn) : null;
		const issuesedDate = issuesedOn ? issuesedOn.toLocaleDateString() : "";
		return`
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${issuesedDate === null ? "" : issuesedDate} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${award.dataValues.name === null ? "" : award.dataValues.name} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${award.dataValues.description === null ? "" : award.dataValues.description}</p>

                                        `;}).join("")}

									 </td>
								</tr>
							</table>



							<!-- Licenses & certifications  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Licenses & certifications </h6>
                                        ${license.map((license) =>{
		const issuesedOn = license.dataValues.issuesedOn ? new Date(license.dataValues.issuesedOn) : null;
		const formatIssuesedOnDate = issuesedOn ? issuesedOn.toLocaleDateString() : "";
		const expirydate = license.dataValues.expirydate ? new Date(license.dataValues.expirydate) : null;
		const formatExpiryDate = expirydate ? expirydate.toLocaleDateString() : "";
		return`
										
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formatIssuesedOnDate === null ? "" : formatIssuesedOnDate} - ${formatExpiryDate === null ? "" : formatExpiryDate}  </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${license.dataValues.name === null ? "": license.dataValues.name}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${license.dataValues.description === null ? "" : license.dataValues.description}</p>
                                        `;}).join("")}

									 </td>
								</tr>
							</table>

							<!-- Languages -->
							<table cellspacing="0" cellpadding="0" style=" width:100%; padding:0px; padding-bottom: 10px;">
								<tr>
									<td align="left" valign="top" > 
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;">  Languages </h6>
                                        ${languages.map((language) =>{ 
		return`
										
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); padding-bottom:5px; font-weight: 600;"> <span style="display: inline-block;">${language.dataValues.language === null ? "" :language.dataValues.language }</p>
										
                                        `;}).join("")}
									</td>
								</tr>
							</table>


							<!-- Volunteer experience  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Volunteer experience </h6>
                                        ${volunteerExperiences.map((volunteerExperiences) => {
		const fromDate = volunteerExperiences.dataValues.fromDate ? new Date(volunteerExperiences.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = volunteerExperiences.dataValues.toDate ? new Date(volunteerExperiences.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return`

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formattedFromDate === null ? "": formattedFromDate} - ${formattedToDate === null ? "" : formattedToDate} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> ${volunteerExperiences.dataValues.organization === null ? "": volunteerExperiences.dataValues.organization}  </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${volunteerExperiences.dataValues.description === null ? "" : volunteerExperiences.dataValues.description}</p>
                                        `;}).join("")}

									 </td>
								</tr>
							</table>


							<!-- Job preferences  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Job preferences </h6>
										${jobPreference.map((jobPreference) =>{
		const jobIndustries = jobPreference.dataValues.jobPreferenceIndustriesDetails;
		return`
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> Industry </p>
										${jobIndustries.map(jobs => `<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:20px;">${jobs.industryDetails.name}</p>`).join("")}


										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> Desired salary </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:20px;">${jobPreference.dataValues.desiredSalaryCurrency===null?"":jobPreference.dataValues.desiredSalaryCurrency} ${jobPreference.dataValues.desiredSalary === null ? "": jobPreference.dataValues.desiredSalary } ${jobPreference.dataValues.desiredSalaryType === null ? "" :jobPreference.dataValues.desiredSalaryType }  </p>


										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> Are you vaccinated </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:20px;">${jobPreference.dataValues.covidVaccinated == 0 ? "No": "Yes"}</p>
                                        `;}).join("")}

									 </td>
								</tr>
							</table>

						</td>

				   	</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
		return sample2;
	}catch (err){
		console.log(err);
		throw err;
	}
};

let downloadSample3 = async (result)=> {
	const skills = result.skills;
	const awards = result.awardsAndHonors;
	const license = result.licenseAndCeritifcations;
	const languages = result.languages;
	const educations = result.educations; 
	const workExperiences = result.workExperiences; 
	const volunteerExperiences = result.volunteerExperiences;
	const userProfile = result.userProfile;
	const jobPreference = result.jobPreferences;
	const projects = result.projects;


	try {
		var sample3 = 
		

`<!DOCTYPE html>
<html style="height:100%;">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width"/>
	<title> Resume 3 </title>
	
</head>

<body style="margin:0px; padding:0px; " >
	<table style="vertical-align:top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 22px; color: #555555; " width="100%" height="100%" border="0" cellspacing="20" cellpadding="0">
		<tr>
			<td align="left" valign="top" style=" width:100%; padding:40px 80px;">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="overflow-x: hidden; border-collapse: collapse;  background:#fff; width:100%; margin:0 auto;padding:0;box-sizing:border-box; border-collapse:collapse;" >
				   	<tr>
						<td align="left" valign="top" style=" width:100%;">

							<table cellspacing="0" cellpadding="0" style="margin:0px; width:100%; padding-bottom:20px;">
								<tr>
									<td align="left" style=" padding:0px; width:50%; ">
										<img src="https://honorvet-dev.s3.amazonaws.com/users/${userProfile.dataValues.profileImage || "profileImages.jpg"}" width="120px" style="border-radius:100%;">
										<p style="margin:0px; word-break: break-all;font-size: 25px; color: #333; padding:20px 0px;font-weight: 600;"><strong>${userProfile.dataValues.name==="null" ? "": userProfile.dataValues.name}</strong></p>
									 	${userProfile.dataValues.location===null?"":`<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;">${userProfile.dataValues.location}</p>`}
									 	${userProfile.dataValues.email===null?"":`<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;">${userProfile.dataValues.email}</p>`}
									 	${userProfile.dataValues.phoneNumber===null?"": `<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px;">${userProfile.dataValues.phoneNumber}</p>`}
									</td>
								</tr>
							</table>

							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:10px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> About Me </h6>
										${userProfile.dataValues.bio===null?"":`<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:15px;">${userProfile.dataValues.bio}</p>`}
									 </td>
								</tr>
							</table>

							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 40px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:30px; font-weight: 700; font-size: 22px; color: #333;"> Work Experience </h6>
										${workExperiences.map((workExperiences) => {
		const fromDate = workExperiences.dataValues.fromDate ? new Date(workExperiences.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = workExperiences.dataValues.toDate ? new Date(workExperiences.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return`
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:15px;">${formattedFromDate===null?"" :formattedFromDate } - ${formattedToDate===null ? "" : formattedToDate}<span style="margin:0px; font-size: 18px; color: #000; "> ${workExperiences.dataValues.companyName=== null ? "" : workExperiences.dataValues.companyName} | ${workExperiences.dataValues.jobTitle===null? "" : workExperiences.dataValues.jobTitle}</span> </p>

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:15px;">${workExperiences.dataValues.description === null ? "" :  workExperiences.dataValues.description}</p>
										`;}).join("")}

									 </td>
								</tr>
							</table>

							<!-- Skills -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 50px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Skills </h6>
										${skills.map((skills) =>{ 
		return`

										<span style="background: rgba(0,0,0,.75); border-radius: 5px; color: #FFF; display: inline-block; list-style: none; margin: 15px 15px 0 0; padding: 10px; text-align: justify; cursor: pointer; font-size: 18px; letter-spacing: 0.5px;">${skills.dataValues.skillDetails.name}</span>
										`;}).join("")}
									 </td>
								</tr>
							</table>


							<!-- Education  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:30px; font-weight: 700; font-size: 22px; color: #333;"> Education </h6>
										${educations.map((education) => {
		const fromDate = education.dataValues.fromDate ? new Date(education.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = education.dataValues.toDate ? new Date(education.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return `

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formattedFromDate===null? "" : formattedFromDate} - ${formattedToDate === null ? "" : formattedToDate}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${education.dataValues.universityDetails=== null ? "" : education.dataValues.universityDetails.name} </p>
										<p style="margin:0px; word-break: break-all;font-size: 14px; color: #333; padding-bottom:5px; font-weight: 600;">${education.dataValues.specializationDetails=== null ? "" : education.dataValues.specializationDetails.name} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${education.dataValues.description===null ? "" : education.dataValues.description}</p>
										`;}).join("")}

									 </td>
								</tr>
							</table>


							<!-- Project Undertaken  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Project Undertaken </h6>
										${projects.map((projects) => {
		const fromDate = projects.dataValues.fromDate ? new Date(projects.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = projects.dataValues.toDate ? new Date(projects.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		const projectLinks = projects.dataValues.projectLinksDetails;
		return `

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formattedFromDate === null ? "" :formattedFromDate} - ${formattedToDate === null ? "" : formattedToDate}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${projects.dataValues.projectTitle === null ? "":projects.dataValues.projectTitle }</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${projects.dataValues.description === null ? "" : projects.dataValues.description}</p>

										${projectLinks.map(link => `<a href="${link.link}" style="margin:0px; font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px;"> ${link.link}</</a>`).join("<br>")}</p>
										`;}).join("")}


									 </td>
								</tr>
							</table>


							<!-- Awards & honors  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Awards & honors </h6>

										${awards.map((award) => {
		const issuesedOn = award.dataValues.issuesedOn ? new Date(award.dataValues.issuesedOn) : null;
		const issuesedDate = issuesedOn ? issuesedOn.toLocaleDateString() : "";
		return`
										
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${issuesedDate===null ? "" : issuesedDate}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${award.dataValues.name === null ? "" : award.dataValues.name}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${award.dataValues.description === null ?"" : award.dataValues.description}</p>
										`;}).join("")}

									 </td>
								</tr>
							</table>



							<!-- Licenses & certifications  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Licenses & certifications </h6>
										${license.map((license) =>{
		const issuesedOn = license.dataValues.issuesedOn ? new Date(license.dataValues.issuesedOn) : null;
		const formatIssuesedOnDate = issuesedOn ? issuesedOn.toLocaleDateString() : "";
		const expirydate = license.dataValues.expirydate ? new Date(license.dataValues.expirydate) : null;
		const formatExpiryDate = expirydate ? expirydate.toLocaleDateString() : "";
		return`

										
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formatIssuesedOnDate === null ? "" : formatIssuesedOnDate} - ${formatExpiryDate === null ? "" : formatExpiryDate}  </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;">${license.dataValues.name === null ? "" : license.dataValues.name}</p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${license.dataValues.description === null ? "" : license.dataValues.description}</p>
										`;}).join("")}


									 </td>
								</tr>
							</table>

							<!-- Languages -->
							<table cellspacing="0" cellpadding="0" style=" width:100%; padding:0px; padding-bottom: 10px;">
								<tr>
									<td align="left" valign="top" > 
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;">  Languages </h6>
										${languages.map((language) =>{ 
		return`
										
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); padding-bottom:5px; font-weight: 600;"> <span style="display: inline-block;">${language.dataValues.language === null ? "" : language.dataValues.language}</p>
										`;}).join("")}
								

									</td>
								</tr>
							</table>


							<!-- Volunteer experience  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Volunteer experience </h6>

										${volunteerExperiences.map((volunteerExperiences) => {
		const fromDate = volunteerExperiences.dataValues.fromDate ? new Date(volunteerExperiences.dataValues.fromDate) : null;
		const formattedFromDate = fromDate ? fromDate.toLocaleDateString() : "";
		const toDate = volunteerExperiences.dataValues.toDate ? new Date(volunteerExperiences.dataValues.toDate) : null;
		const formattedToDate = toDate ? toDate.toLocaleDateString() : "";
		return`

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:5px;">${formattedFromDate === null ? "" : formattedFromDate} - ${formattedToDate === null ? "" : formattedToDate} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> ${volunteerExperiences.dataValues.organization === null ? "" :  volunteerExperiences.dataValues.organization} </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:30px;">${volunteerExperiences.dataValues.description === null ? "" : volunteerExperiences.dataValues.description}</p>
										`;}).join("")}

									 </td>
								</tr>
							</table>


							<!-- Job preferences  -->
							<table cellspacing="0" cellpadding="0" style="margin:0px; padding:0px;padding-bottom: 10px; width:100%">
								<tr>
									<td align="left" valign="top" >
										<h6 style="margin:0px; padding-top:20px; padding-bottom:20px; font-weight: 700; font-size: 22px; color: #333;"> Job preferences </h6>
										${jobPreference.map((jobPreference) =>{
		const jobIndustries = jobPreference.dataValues.jobPreferenceIndustriesDetails;
		return`

										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> Industry </p>
										${jobIndustries.map(jobs => `<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:20px;">${jobs.industryDetails.name}</p>`).join("")}


										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> Desired salary </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:20px;"> ${jobPreference.dataValues.desiredSalaryCurrency===null?"":jobPreference.dataValues.desiredSalaryCurrency} ${jobPreference.dataValues.desiredSalary=== null ? "" : jobPreference.dataValues.desiredSalary} ${jobPreference.dataValues.desiredSalaryType === null ? "" : jobPreference.dataValues.desiredSalaryType}</p>


										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; font-weight: 600; padding-bottom:5px;"> Are you vaccinated </p>
										<p style="margin:0px; word-break: break-all;font-size: 18px; color: rgba(0,0,0,.5); line-height: 25px; padding-bottom:20px;">${jobPreference.dataValues.covidVaccinated == 0 ? "No": "Yes"} </p>
										`;}).join("")}


									 </td>
								</tr>
							</table>

						</td>

				   	</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;

		return sample3;
	}catch (err){
		console.log(err);
		throw err;
	}
};