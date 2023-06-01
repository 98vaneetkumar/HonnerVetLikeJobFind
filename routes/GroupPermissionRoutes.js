
var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");



router.get("/", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.GroupPermissionController.getAllGroupPermissions, payload, req, res);
});

router.get("/detail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.GroupPermissionController.getGroupPermissionById, req.params, req, res);
});

router.post("/",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.GroupPermissionController.addGroupPermission, req.body, req, res);
});

router.put("/", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.GroupPermissionController.updateGroupPermission, req.body, req, res);
});

router.delete("/", authentication, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.GroupPermissionController.updateGroupPermission, payload, req, res);
});

//Mange Users API

router.get("/manage", authentication,   (req, res) => {
	let payload =  req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.GroupPermissionController.getAllGroupManageUsers, payload, req, res);
});

router.delete("/manage",authentication,  (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	payload.select =1;
	return sendResponse.executeMethod(Controllers.GroupPermissionController.userGroupPermissionDelete, payload, req, res);
});

router.get("/manage/detail", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.RecruiterUsersController.getAllRecruiterManageUsers, payload, req, res);
});

router.post("/manage", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.GroupPermissionController.addUserGroup, req.body, req, res);
});


module.exports = router;