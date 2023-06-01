var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");


router.get("/", authentication, (req, res) => {
	let payload = req.body;
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterDashboardController.getStatslisting, payload, req, res);
});


module.exports = router;