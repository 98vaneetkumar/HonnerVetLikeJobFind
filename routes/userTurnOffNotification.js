var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/authentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();

router.post("/", authentication, (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.UserTurnOffNotificationController.save,
		req.body,
		req,
		res
	);
});

router.delete("/", authentication, multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(
		Controllers.UserTurnOffNotificationController.delete,
		payload,
		req,
		res
	);
});

module.exports = router;
