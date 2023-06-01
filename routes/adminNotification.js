var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/authentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();

router.post("/", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.AdminNotificationController.save, req.body, req, res);
});

router.get("/", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminNotificationController.getList, payload, req, res);
});

router.get("/detail/:id", authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminNotificationController.getDetail, req.params, req, res);
});

router.put("/", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.AdminNotificationController.update, req.body, req, res);
});

router.put("/block", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.AdminNotificationController.update, req.body, req, res);
});


router.delete("/", authentication,  multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.AdminNotificationController.update, payload, req, res);
});

module.exports = router;