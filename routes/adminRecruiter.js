var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");

router.get("/listing", authentication, (req, res) => {
	let payload = req.query;
	
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getAlllisting, payload, req, res);
});

router.get("/subRecruiterListing", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getAllSubRecruiterlisting, payload, req, res);
});

router.get("/subRecruiter/detail/:id", authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getSubRecruiterUsersById, req.params, req, res);
});

router.get("/companyJobs", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getCompanyJobsById, payload, req, res);
});

router.get("/subRecruiterJobs", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getSubRecruiterJobsById, payload, req, res);
});

router.get("/subRecruiterJobs/detail/:id", authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getSubRecruiterJobsDetailById, req.params, req, res);
});

router.get("/candidateHiredRejected", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getSubRecruiterHiredRejectedById, payload, req, res);
});

router.get("/subscriptionHistory/detail", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getSubscriptionHistoryDetailById, payload, req, res);
});

router.get("/candidateHiredRejected/detail/:id", authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getSubRecruiterHiredRejectedDetailById, req.params, req, res);
});

router.get("/detail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.getDetailsById, req.params, req, res);
});
router.delete("/delete", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.deleteUser, payload, req, res);
});
router.put("/block", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.userUpdate, payload, req, res);
});
router.put("/permission", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.AdminRecruiterController.adminPermission, payload, req, res);
});

module.exports = router;