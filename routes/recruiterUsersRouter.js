var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");


router.get("/", authentication, (req, res) => {
	let payload = req.query || {};
	payload.id = req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.RecruiterUsersController.getAllRecruiterUsers, payload, req, res);
});

router.get("/detail/:id", authentication,  (req, res) => {
	return sendResponse.executeMethod(Controllers.RecruiterUsersController.getRecruiterUsersById, req.params, req, res);
});

router.post("/", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterUsersController.addRecruiterUsers, req.body, req, res);
});

router.put("/",  authentication,  (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.RecruiterUsersController.updateRecruiterUsers, payload, req, res);
});

router.delete("/", authentication,   (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.RecruiterUsersController.updateRecruiterUsers, payload, req, res);
});

module.exports = router;