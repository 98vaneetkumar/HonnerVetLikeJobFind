var express = require("express");
var router = express.Router();
// const authentication = require("../middleWares/adminAuthentication").verifyToken;
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
const config = require("../config/env")();

router.post("/getSignedURL", async(req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.UploadController.getS3UploadURL, payload, req, res);
});

router.get("/s3folders", async(req, res) => {
	let data = config.AWS.S3;
	return sendResponse.sendSuccessMessage("success", data, res);
});

module.exports = router;