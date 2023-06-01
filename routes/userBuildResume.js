var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/authentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
//var multiPart = require("connect-multiparty");
//var multiPartMiddleware = multiPart();

router.get("/getResume", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getResume, payload, req, res);
});


router.get("/getSkills", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getSkills, payload, req, res);
});


router.put("/addUpdateSkills", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addUpdateSkills, payload, req, res);
});
router.put("/addUpdateSkillsV1", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addUpdateSkillsV1, payload, req, res);
});

router.get("/getEducation", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getEducation, payload, req, res);
});


router.post("/addEducation", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addEducation, payload, req, res);
});
router.post("/addEducationV1", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addEducationV1, payload, req, res);
});

router.put("/updateEducation", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateEducation, payload, req, res);
});
router.put("/updateEducationV1", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateEducationV1, payload, req, res);
});

router.delete("/deleteEducation", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteEducation, payload, req, res);
});


router.get("/getWorkExperience", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getWorkExperience, payload, req, res);
});


router.post("/addWorkExperience", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addWorkExperience, payload, req, res);
});

router.put("/updateWorkExperience", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateWorkExperience, payload, req, res);
});

router.delete("/deleteWorkExperience", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteWorkExperience, payload, req, res);
});



router.get("/getVolunteerExperience", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getVolunteerExperience, payload, req, res);
});


router.post("/addVolunteerExperience", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addVolunteerExperience, payload, req, res);
});

router.put("/updateVolunteerExperience", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateVolunteerExperience, payload, req, res);
});

router.delete("/deleteVolunteerExperience", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteVolunteerExperience, payload, req, res);
});


router.get("/getProjectTaken", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getProjectTaken, payload, req, res);
});


router.post("/addProjectTaken", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addProjectTaken, payload, req, res);
});

router.put("/updateProjectTaken", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateProjectTaken, payload, req, res);
});

router.delete("/deleteProjectTaken", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteProjectTaken, payload, req, res);
});




router.get("/getAwardsAndHonors", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getAwardsAndHonors, payload, req, res);
});


router.post("/addAwardsAndHonors", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addAwardsAndHonors, payload, req, res);
});

router.put("/updateAwardsAndHonors", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateAwardsAndHonors, payload, req, res);
});

router.delete("/deleteAwardsAndHonors", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteAwardsAndHonors, payload, req, res);
});




router.get("/getLicenseAndCertification", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getLicenseAndCertification, payload, req, res);
});


router.post("/addLicenseAndCertification", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addLicenseAndCertification, payload, req, res);
});

router.put("/updateLicenseAndCertification", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateLicenseAndCertification, payload, req, res);
});

router.delete("/deleteLicenseAndCertification", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteLicenseAndCertification, payload, req, res);
});



router.get("/getLanguage", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getLanguage, payload, req, res);
});


router.post("/addLanguage", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addLanguage, payload, req, res);
});
router.post("/addLanguageMultiple", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addLanguageMultiple, payload, req, res);
});

router.put("/updateLanguage", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateLanguage, payload, req, res);
});

router.delete("/deleteLanguage", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteLanguage, payload, req, res);
});



router.get("/getJobPreference", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.getJobPreference, payload, req, res);
});


router.post("/addJobPreference", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addJobPreference, payload, req, res);
});
router.post("/addJobPreferenceV1", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.addJobPreferenceV1, payload, req, res);
});

router.put("/updateJobPreference", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.updateJobPreference, payload, req, res);
});

router.delete("/deleteJobPreference", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.deleteJobPreference, payload, req, res);
});

//recommended job for user profile
router.get("/recommendedJob", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.getRecommandedJob,
		payload,
		req,
		res
	);
});
module.exports = router;