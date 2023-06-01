
var express = require("express");
var router = express.Router();
let config = require("../config/env")();
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;



router.get("/allCommon",  (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.allCommanRecruiteSideSearch, payload, req, res);
});

router.get("/searchJobTitle", (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.CommonController.getJobTitlesAndSuggestJobTitle, payload, req, res);
});

router.get("/skills", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getSkills, payload, req, res);
});

router.post("/getSignedURL", authentication, async(req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.UploadController.getS3UploadURL, payload, req, res);
});

router.get("/employmentTypes", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.CommonController.getEmploymentTypes, payload, req, res);
});

router.get("/travelRequirements", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminTravelRequirementController.getList, payload, req, res);
});

router.get("/benefits", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminBenefitsController.getList, payload, req, res);
});

router.get("/notifications", (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.AdminUsersController.getAlllisting, payload, req, res);
});

router.get("/schedules", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminScheduleController.getList, payload, req, res);
});

router.get("/supplements", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminSupplememtsController.getList, payload, req, res);
});

router.get("/screening-question", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminScreeningQuestionController.getList, payload, req, res);
});

router.get("/eligibles", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminEligibleController.getList, payload, req, res);
});

router.get("/personalities", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminPersonalitiesController.getList, payload, req, res);
});


router.get("/hires", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminHireController.getList, payload, req, res);
});

router.get("/industry",  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminIndustriesController.getList, payload, req, res);
});

router.get("/industry",  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminIndustriesController.getList, payload, req, res);
});

router.get("/categories", (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.getListCategories, payload, req, res);
});

router.get("/getSubCategories", (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.getListSubCategories, payload, req, res);
});

router.get("/payment", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getList, payload, req, res);
});

router.get("/s3folders", async(req, res) => {
	let data = config.AWS.S3;
	return sendResponse.sendSuccessMessage("success", data, res);
});

// landing page api 

router.get("/landingPage", (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminSuccessStoriesController.getList, payload, req, res);
});




module.exports = router;