var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");

router.get("/",authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.adminJobsPostedController.getList, payload, req, res);
});

router.get("/:id",authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.adminJobsPostedController.getDetail, req.params, req, res);
});

module.exports = router;