var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/authentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");



router.get("/",authentication, (req, res) => {
	let payload = req.query;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.HomeScreenController.home, payload, req, res);
});

router.get("/guestUser",authentication, (req, res) => {
	let payload = req.query;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.HomeScreenController.guestUser, payload, req, res);
});

router.post("/jobpost", authentication, (req, res) => {
	let payload = req.body;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.userId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.HomeScreenController.getList,payload,req,res);
});


//recommended job for user profile
router.get("/recommendedJob", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(
		Controllers.JobPostController.getRecommandedJob,
		payload,
		req,
		res
	);
});


router.get("/latestJob", authentication, (req, res) => {
	let payload = req.body || {};
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	console.log("test");
	return sendResponse.executeMethod(
		Controllers.JobPostController.latestJob,
		payload,
		req,
		res
	);
});

module.exports = router;