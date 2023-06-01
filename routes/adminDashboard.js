var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");

router.get("/stats", authentication, (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.AdminDashboardController.getStatslisting, payload, req, res);
});

router.get("/detail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminDashboardController.getDetailsById, req.params, req, res);
});
router.get("/dashboardGraph", authentication, (req, res) => {
	let payload = req.query;
	return sendResponse.executeMethod(Controllers.AdminDashboardController.getGraphList, payload, req, res);
});
module.exports = router;