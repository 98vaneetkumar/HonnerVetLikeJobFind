
var express = require("express");
var router = express.Router();
let config = require("../config/env")();
const authentication = require("../middleWares/authentication").verifyToken;
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");


router.post("/register",  async(req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.UserController.registerUser, payload, req, res);
});
router.put("/verify-otp", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.verifyOtp, payload, req, res);
});
router.put("/resendSignUpOtp", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.resendSignUpOtp, payload, req, res);
});
router.put("/setUserPassword", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.setUserPassword, payload, req, res);
});
router.post("/login",  async(req, res) => {
	let payload = req.body;
	payload.ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
	return sendResponse.executeMethod(Controllers.UserController.loginUser, payload, req, res);
});
router.post("/social/login",  async(req, res) => {
	let payload = req.body;
	payload.ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
	return sendResponse.executeMethod(Controllers.UserController.oauthSocialLogin, payload, req, res);
});
router.put("/forgotPassword",  async(req, res) => {
	let payload = req.body || {};
	return sendResponse.executeMethod(Controllers.UserController.forgotPassword, payload, req, res);
});
router.put("/resetEmailPassword", (req, res) => {
	return sendResponse.executeMethod(Controllers.UserController.resetPassword, req.body, req, res);
});
router.put("/changePassword", authentication, async(req, res) => {
	let tokenData = req.credentials;
	let payload = req.body;
	payload.id = tokenData.id;
	return sendResponse.executeMethod(Controllers.UserController.changePassword, payload, req, res);
});
router.put("/logout", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.logout, payload, req, res);
});
router.put("/uploadAuthenticityDocuments",  authentication, async(req, res) => {
	let payload = req.body;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.uploadAuthenticityDocuments, payload, req, res);
});
router.put("/uploadAuthenticityDocumentsV1",  authentication, async(req, res) => {
	let payload = req.body;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.uploadAuthenticityDocumentsV1, payload, req, res);
});
router.put("/updateProfile",  authentication, async(req, res) => {
	let payload = req.body;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.updateProfile, payload, req, res);
});
router.post("/uploadDocuments", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.uploadDocuments, payload, req, res);
});
router.put("/updateUploadDocuments", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.updateUploadDocuments, payload, req, res);
});
router.put("/userMobileVerify", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.userMobileVerify, payload, req, res);
});
router.put("/userMobileVerifyOtp", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.userMobileVerifyOtp, payload, req, res);
});
router.delete("/deleteUploadDocuments", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.deleteUploadDocuments, payload, req, res);
});
router.post("/deleteUserAccount", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.deleteUserAccount, payload, req, res);
});
router.get("/getAllUploadDocuments", authentication, (req, res) => {
	let payload = req.query || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.getAllUploadDocuments, payload, req, res);
});

router.get("/getUserDetails", authentication, (req, res) => {
	let payload = req.query || {};
	payload.tokenId = req.credentials.id;
	payload.ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
	return sendResponse.executeMethod(Controllers.UserController.getUserDetails, payload, req, res);
});

router.get("/getUserResumeStatus", authentication, (req, res) => {
	let payload = req.query || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.getUserResumeStatus, payload, req, res);
});

router.post("/documentsParsing", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.userResumeParsingController.resumeParsingData, payload, req, res);
});
router.post("/downloadResume", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.userId = req.credentials.id;
	console.log("kkk");
	return sendResponse.executeMethod(Controllers.UserDownloadResumeController.downloadResume, payload, req, res);
});
router.get("/privacy-policy", (req, res, next) => {
	console.log(next);
	res.render("detailpages/privacy-policy");
});

router.get("/terms", (req, res, next) => {
	console.log(next);
	res.render("detailpages/terms");
});

router.get("/about", (req, res, next) => {
	console.log(next);
	res.render("detailpages/about");
});

router.get("/generatePassword", async (req, res, next) => {
	try {
		console.log(next);
		await Controllers.UserController.validateToken(req.query);
		res.render("change-password-user", {
			token: req.query.token,
			email: req.query.email,
			baseUrl: config.APP_URLS.API_URL,
			s3Url: config.AWS.S3.s3Url
		});
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired",{
				baseUrl: config.APP_URLS.API_URL
			});
		}
	}
});
router.get("/passwordSuccess", async (req, res) => {
	try {
		res.render("password-success",{
			baseUrl: config.APP_URLS.API_URL,
			s3Url: config.AWS.S3.s3Url
		});
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired", {
				baseUrl: config.APP_URLS.API_URL,
				s3Url: config.AWS.S3.s3Url
			});
		}
	}
});
router.get("/recruiterlist", authentication,(req, res) => {
	let payload = req.query;
	payload.userId = req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.UserJobController.recruiterlist, payload, req, res);
});

router.get("/recruiterDetails/:id",authentication, (req, res) => {
	let payload = req.params ;
	return sendResponse.executeMethod(Controllers.UserJobController.recruiterDetails, payload, req, res);
});
router.get("/report", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.userReport, payload, req, res);
});
router.get("/searchAppearanceGraph", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.searchAppearance, payload, req, res);
});
router.get("/searchViewGraph", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.searchViewGraph, payload, req, res);
});
router.get("/recruiterAction", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.recruiterAction, payload, req, res);
});
router.get("/viewlisting", authentication, (req, res) => {
	let payload = req.query || {};
	payload.userId = req.credentials.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.UserBuildResumeController.viewlisting, payload, req, res);
});
router.put("/notificationSetting", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserController.notificationSetting, payload, req, res);
});


module.exports = router;