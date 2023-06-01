var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");

router.get("/notActiveUserNotification",  (req, res) => {
	let payload =  req.query;
	return sendResponse.executeMethod(Controllers.ScheduleController.inNotActiveUserNotification, payload, req, res);
});

router.get("/updateResumeNotification",  (req, res) => {
	let payload =  req.query;
	return sendResponse.executeMethod(Controllers.ScheduleController.updateResumeNotification, payload, req, res);
});

module.exports = router;