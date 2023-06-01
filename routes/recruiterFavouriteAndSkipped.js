
var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/recruiterAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");

router.get("/favourite", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.getAllFavourite, payload, req, res);
});

router.get("/favourite/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.getFavouriteById, req.params, req, res);
});

router.post("/favourite",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.addFavourite, req.body, req, res);
});

router.put("/favourite", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.updateFavourite, req.body, req, res);
});

router.delete("/favourite", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.deleteFavourite, payload, req, res);
});


router.get("/skipped", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.getAllskipped, payload, req, res);
});

router.get("/skipped/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.getskippedById, req.params, req, res);
});

router.post("/skipped",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.addskipped, req.body, req, res);
});

router.put("/skipped", authentication,  (req, res) => {
	let payload = req.body || {};
	payload.recuriterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.updateskipped, req.body, req, res);
});

router.delete("/skipped", authentication, (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.deleteskipped, payload, req, res);
});
router.post("/addCard",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.addCard, req.body, req, res);
});
router.put("/updateCard",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.updateCard, req.body, req, res);
});
router.get("/getAllCardlist", authentication,  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.getAllCardlist, payload, req, res);
});
router.delete("/deleteCard", authentication, (req, res) => {
	let payload = req.body;
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.deleteCard, payload, req, res);
});
router.post("/recruiterSubcriptionPlan",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.recruiterSubcriptionPlan, req.body, req, res);
});
router.post("/cancelSubscription",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.cancelSubscription, req.body, req, res);
});
router.post("/recruiterPurchaseInventroyPlan",authentication, (req, res) => {
	let payload = req.body || {};
	payload.recruiterId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.FavouriteAndSkippedController.recruiterPurchaseInventroyPlan, req.body, req, res);
});


module.exports = router;