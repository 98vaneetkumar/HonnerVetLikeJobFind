var express = require("express");
var router = express.Router();
let config = require("../config/env")();
const authentication = require("../middleWares/authentication").verifyToken;
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();


router.get("/appVersion", async(req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.AppVersionController.getAppVersionByPlatform, payload, req, res);
});
router.post("/getSignedURL", authentication, async(req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.UploadController.getS3UploadURL, payload, req, res);
});
router.get("/s3folders", async(req, res) => {
	let data = config.AWS.S3;
	return sendResponse.sendSuccessMessage("success", data, res);
});
router.post("/uploadObjectToS3", multiPartMiddleware, async(req, res) => {
	return sendResponse.executeMethod(Controllers.UploadController.uploadObjectToS3, req, req, res);
});

router.get("/skills", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getSkills, payload, req, res);
});

router.get("/services", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getServices, payload, req, res);
});


router.get("/employmentTypes", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getEmploymentTypes, payload, req, res);
});

router.get("/specializations", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getSpecializations, payload, req, res);
});

router.get("/universities",  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getUniversities, payload, req, res);
});

router.get("/travelRequirements", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.travelRequirements, payload, req, res);
});

router.get("/securityClearence",  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.securityClearance, payload, req, res);
});
router.get("/getAllsecurityClearanceAndtravelRequirements",  (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.CommonController.getAllsecurityClearanceAndtravelRequirements, payload, req, res);
});
router.get("/allUniversitiesAndSpecializations",  (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.CommonController.allUniversitiesAndSpecializations, payload, req, res);
});
router.get("/allIndustriesAndJobTitle",  (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.CommonController.allIndustryAndJobTitle, payload, req, res);
});

router.get("/searchSkills", (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.CommonController.getSkillsAndSuggestSkill, payload, req, res);
});
router.get("/getCommanAll", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getCommanAll, payload, req, res);
});


router.get("/getCategories", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.getListCategories, payload, req, res);
});
router.get("/downloadResumeSample", (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.CommonController.downloadResumeSample, payload, req, res);
});



module.exports = router;