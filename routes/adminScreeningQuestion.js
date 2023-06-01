var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");


router.post("/",authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminScreeningQuestionController.save, req.body, req, res);
});

router.get("/", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminScreeningQuestionController.getList, payload, req, res);
});

router.put("/", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminScreeningQuestionController.update, req.body, req, res);
});

router.put("/block",authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminScreeningQuestionController.update, req.body, req, res);
});


router.delete("/",  authentication, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.AdminScreeningQuestionController.update, payload, req, res);
});

module.exports = router;