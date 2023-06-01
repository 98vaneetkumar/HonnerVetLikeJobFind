var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
// const authentication = require("../middleWares/adminAuthentication").verifyToken;
const authentication =
	require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();

router.get("/suggested",authentication, (req, res) => {
	let payload = req.query;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recuiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.JobPostController.suggestedCanditate, payload, req, res);
});

router.post("/suggested/sortListed",authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.JobPostController.suggestedCanditateShortListed, payload, req, res);
});

router.post("/suggested/hide",authentication, (req, res) => {
	let payload = req.body;
	payload.recuiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.JobPostController.suggestedCanditateHide, payload, req, res);
});

router.post("/add", authentication, (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.save,
		req.body,
		req,
		res
	);
});

router.post("/saveJob", authentication, (req, res) => {
	let payload = req.body || {};
	payload.recuiterId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.saveJobs,
		req.body,
		req,
		res
	);
});

router.post("/", authentication, (req, res) => {
	let payload = req.body;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(
		Controllers.JobPostController.getList,
		payload,
		req,
		res
	);
});

router.get("/", authentication, (req, res) => {
	let payload = req.query;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(
		Controllers.JobPostController.getList,
		payload,
		req,
		res
	);
});

router.get("/getList/web", authentication, (req, res) => {
	let payload = req.query;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.getListForWeb,
		payload,
		req,
		res
	);
});

router.get("/activeJobsLists", authentication, (req, res) => {
	let payload = req.query;
	payload.recruiterId = req.credentials.id;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(
		Controllers.JobPostController.activeJobsLists,
		payload,
		req,
		res
	);
});


router.get("/applicant/detail", authentication,(req, res) => {
	let payload = req.query;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(
		Controllers.JobPostController.applicates,
		payload,
		req,
		res
	);
});

router.get("/activity/detail", authentication,(req, res) => {
	let payload = req.query;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.activityPerformByAllRecruiterOnCandidate,
		payload,
		req,
		res
	);
});

router.put("/applicant/statusUpdate", authentication, (req, res) => {
	let payload=req.body;
	payload.recuiterId=req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.applicateStatusUpdate,
		payload,
		req,
		res
	);
});

router.put("/jobClose/reason", authentication, (req, res) => {
	let payload=req.body;
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.closeJob,
		payload,
		req,
		res
	);
});

router.put("/", authentication, (req, res) => {
	let payload = req.body || {};
	payload.recuiterId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.update,
		req.body,
		req,
		res
	);
});

router.put("/userNotes/update", authentication, (req, res) => {
	let payload = req.body || {};
	payload.recuiterId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.updateUserNotes,
		req.body,
		req,
		res
	);
});


router.delete("/userNotes/delete", authentication, (req, res) => {
	let payload = req.body || {};
	payload.recuiterId = req.credentials.id;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(
		Controllers.JobPostController.updateUserNotes,
		req.body,
		req,
		res
	);
});
router.delete("/", authentication, multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	payload.recuiterId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.update,
		payload,
		req,
		res
	);
});

router.get("/getUser/:id/:userId", authentication, (req, res) => {
	let payload = req.params;
	return sendResponse.executeMethod(Controllers.JobPostController.getResume, payload, req, res);
});

router.get("/getUserAllNotes", authentication, (req, res) => {
	// let payload = req.params;
	let payload = req.query;
	if (payload.skip && payload.limit && payload.skip > 0) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.JobPostController.getUserAllNotes, payload, req, res);
});

router.get("/:id", authentication, (req, res) => {
	let payload = req.params;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.getDetail,
		payload,
		req,
		res
	);
});

router.get("/v1/:id", authentication, (req, res) => {
	let payload = req.params;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.JobPostController.getDetails,
		payload,
		req,
		res
	);
});


module.exports = router;
