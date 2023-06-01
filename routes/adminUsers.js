var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");

router.get("/listing", authentication, (req, res) => {
	let payload = req.query;
	
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminUsersController.getAlllisting, payload, req, res);
});

router.get("/detail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminUsersController.getDetailsById, req.params, req, res);
});
router.delete("/delete", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.AdminUsersController.deleteUser, payload, req, res);
});
router.put("/block", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.AdminUsersController.userUpdate, payload, req, res);
});

module.exports = router;