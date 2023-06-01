var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");

router.get("/", authentication,  (req, res) => {
	let payload = req.query;
	payload.recruiterId=req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.RecruiterTemplateController.getList, payload, req, res);
});

router.get("/detail/:id", authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.RecruiterTemplateController.getDetail, req.params, req, res);
});
router.post("/", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterTemplateController.save, payload, req, res);
});

router.put("/",  authentication,   (req, res) => {
	let payload = req.body || {};
	payload.recruiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterTemplateController.update, payload, req, res);
});

router.delete("/", authentication,  (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.RecruiterTemplateController.update, payload, req, res);
});


module.exports = router;