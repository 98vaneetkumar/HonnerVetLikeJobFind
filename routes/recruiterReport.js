var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");


router.get("/userActivity", authentication, (req, res) => {
	let payload = req.body;
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterReportController.getuserActivityReport, payload, req, res);
});

router.get("/searchDetail", authentication, (req, res) => {
	let payload = req.body;
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterReportController.getsearchDetailReport, payload, req, res);
});


module.exports = router;