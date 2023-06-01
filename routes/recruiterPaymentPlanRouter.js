var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
// var multiPart = require("connect-multiparty");
// var multiPartMiddleware = multiPart();

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
// Recruiter Transaction get listing API

router.get("/transaction", authentication, (req, res) => {
	let payload = req.query;
	payload.recruiterId = req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.RecruiterController.getListTransaction, payload, req, res);
});
router.get("/getActivePlanlist", authentication,  (req, res) => {
	let payload = req.query;
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterController.getActivePlanlist, payload, req, res);
});

router.get("/promoCode", authentication, (req, res) => {
	let payload = req.query;
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.PaymentPlanController.getCheckPromoCode, payload, req, res);
});


module.exports = router;