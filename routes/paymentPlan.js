var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();

router.post("/", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.PaymentPlanController.save, req.body, req, res);
});

router.get("/", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getList, payload, req, res);
});

router.get("/detail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getDetail, req.params, req, res);
});

router.put("/", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.PaymentPlanController.update, req.body, req, res);
});

router.put("/block", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.PaymentPlanController.update, req.body, req, res);
});

router.delete("/", authentication, multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.PaymentPlanController.update, payload, req, res);
});

// Recruiter transaction

router.get("/transaction", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getListTransaction, payload, req, res);
});

router.get("/transaction/detail/:id",  (req, res) => {
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getListTransactionDetail, req.params, req, res);
});

// payment plan  users detail 

router.get("/userDetail",  (req, res) => {
	let payload =  req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getOnePlanAllUsers, payload, req, res);
});

module.exports = router;