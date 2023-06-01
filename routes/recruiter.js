var express = require("express");
const env = require("../config/env")();
var router = express.Router();
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const Controller = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();
let config = require("../config/env")();

router.post("/register",  async(req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controller.RecruiterController.registerUser, payload, req, res);
});
router.put("/verify-otp", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.verifyOtp, payload, req, res);
});
router.put("/resendSignUpOtp", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.resendSignUpOtp, payload, req, res);
});
router.put("/setUserPassword", authentication,  async(req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.setUserPassword, payload, req, res);
});
router.put("/profile/change-password", authentication, multiPartMiddleware, async (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.changePassword, payload, req, res);
});

router.post("/login", (req, res) => {
	return sendResponse.executeMethod(Controller.RecruiterController.loginUser, req.body, req, res);
});
router.put("/logout", authentication, (req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.logout, payload, req, res);
});

router.post("/forgot-password", multiPartMiddleware, (req, res) => {
	return sendResponse.executeMethod(Controller.RecruiterController.forgotPassword, req.body, req, res);
});
router.get("/generatePassword", multiPartMiddleware, async (req, res) => {
	try {
		await Controller.RecruiterController.validateToken(req.query);
		// return sendResponse.sendSuccessMessage("success", data, res);
		res.render("change-password-recruiter", {
			token: req.query.token,
			email: req.query.email,
			baseUrl: config.APP_URLS.API_URL,
			s3Url: config.AWS.S3.s3Url
		});
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired");
		}
	}
});
router.get("/password-success", multiPartMiddleware, async (req, res) => {
	try {
		res.render("password-success",{
			host: env.APP_URLS.ADMIN_URL,
			s3Url: config.AWS.S3.s3Url
		});
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired.pug");
		}
	}
});

router.get("/list", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controller.RecruiterController.getAllRecruiter, payload, req, res);
});

router.get("/recruiter/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controller.RecruiterController.getRecruiterById, req.params, req, res);
});
router.get("/recruiterPermission/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controller.RecruiterController.getRecruiterPermissionById, req.params, req, res);
});

router.put("/reset-password", multiPartMiddleware, (req, res) => {
	return sendResponse.executeMethod(Controller.RecruiterController.resetNewPassword, req.body, req, res);
});


router.put("/profile/change-password", authentication, multiPartMiddleware, async (req, res) => {

	let tokenData = req.credentials;
	let payload = req.body;
	payload.id = tokenData.id;
	return sendResponse.executeMethod(Controller.RecruiterController.resetPassword, payload, req, res);
});

router.put("/updateProfile", authentication, multiPartMiddleware, async (req, res) => {

	let payload = req.body;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.updateProfile, payload, req, res);
});



router.put("/billingAddress", authentication, multiPartMiddleware, async (req, res) => {

	let payload = req.body;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.updatebillingAddress, payload, req, res);
});

router.get("/billingAddress", authentication, multiPartMiddleware, async (req, res) => {

	let payload = req.query;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.getbillingAddress, payload, req, res);
});



router.get("/state", authentication, (req, res) => {
	return sendResponse.executeMethod(Controller.RecruiterController.getAllUsState, req.params, req, res);
});
router.put("/recurring-payment", authentication, (req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.resetRecurringPayment, req.body, req, res);
});
router.put("/recurring-notification", authentication, (req, res) => {
	let payload = req.body || {};
	payload.tokenId = req.credentials.id;
	return sendResponse.executeMethod(Controller.RecruiterController.resetRecurringNotification, req.body, req, res);
});


module.exports = router;