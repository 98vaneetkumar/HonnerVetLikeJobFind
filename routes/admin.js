
var express = require("express");
var router = express.Router();
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const Controller = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();
let config = require("../config/env")();

router.post("/login", (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.login, req.body, req, res);
});
router.put("/logout", authentication, (req, res) => {

	let token = req.credentials;
	return sendResponse.executeMethod(Controller.AdminController.logout, token, req, res);
});

router.post("/forgot-password", multiPartMiddleware, (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.forgotPassword, req.body, req, res);
});
router.get("/generatePassword", multiPartMiddleware, async (req, res) => {
	try {
		await Controller.AdminController.validateToken(req.query);
		// return sendResponse.sendSuccessMessage("success", data, res);
		res.render("change-password-admin", {
			token: req.query.token,
			email: req.query.email,
			baseUrl: config.APP_URLS.API_URL,
			s3Url: config.AWS.S3.s3Url
		});
	} catch (err) {
		if (err) {
			res.render("link-expired",{
				baseUrl: config.APP_URLS.API_URL,
				s3Url: config.AWS.S3.s3Url
			});
			// return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired",{
				baseUrl: config.APP_URLS.API_URL,
				s3Url: config.AWS.S3.s3Url
			});
		}
	}
});
router.get("/password-success", multiPartMiddleware, async (req, res) => {
	try {
		res.render("password-success",{
			baseUrl: config.APP_URLS.API_URL,
			s3Url: config.AWS.S3.s3Url
		});
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired",{
				baseUrl: config.APP_URLS.API_URL,
				s3Url: config.AWS.S3.s3Url
			});
			
		}
	}
});
router.put("/reset-password", multiPartMiddleware, (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.resetNewPassword, req.body, req, res);
});


router.post("/", multiPartMiddleware, (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.addAdmin, req.body, req, res);
});

router.put("/", authentication, multiPartMiddleware, async (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.updateAdmin, req.body, req, res);
});

router.get("/list", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.adminId = req.credentials.id;
	return sendResponse.executeMethod(Controller.AdminController.getAllAdmins, payload, req, res);
});

router.get("/adminDetail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.getAdminById, req.params, req, res);
});

router.put("/block", authentication, multiPartMiddleware, (req, res) => {
	return sendResponse.executeMethod(Controller.AdminController.updateAdmin, req.body, req, res);
});

router.delete("/", authentication, multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controller.AdminController.updateAdmin, payload, req, res);
});
router.get("/profile", authentication, (req, res) => {
	let token = req.credentials;
	return sendResponse.executeMethod(Controller.AdminController.getAdminProfile, token.id, req, res);
});
router.put("/profile/change-password", authentication, multiPartMiddleware, async (req, res) => {

	let tokenData = req.credentials;
	let payload = req.body;
	payload.id = tokenData.id;
	return sendResponse.executeMethod(Controller.AdminController.resetPassword, payload, req, res);
});

router.put("/edit-profile", authentication, multiPartMiddleware, async (req, res) => {

	let payload = req.body;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controller.AdminController.updateAdmin, payload, req, res);
});

module.exports = router;