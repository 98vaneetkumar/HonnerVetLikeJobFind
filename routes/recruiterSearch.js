var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");



router.post("/",authentication, (req, res) => {
	let payload = req.body;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.filterUser, payload, req, res);
});

router.post("/saveSearch",authentication, (req, res) => {
	let payload = req.body;
	payload.recuiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.saveSearch, payload, req, res);
});


router.get("/getSaveSearch",authentication, (req, res) => {
	let payload = req.query||{};
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recuiterId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.getSearch, payload, req, res);
});

router.delete("/deleteSaveSearch", authentication,   (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.RecruiterSearchController.deleteSearch, payload, req, res);
});
module.exports = router;