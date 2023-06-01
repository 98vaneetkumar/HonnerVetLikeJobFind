var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
// const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();

router.post("/",  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminPromoCodeController.save, req.body, req, res);
});

router.get("/",  (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminPromoCodeController.getList, payload, req, res);
});

router.get("/detail/:id",  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminPromoCodeController.getDetail, req.params, req, res);
});

router.put("/",  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminPromoCodeController.update, req.body, req, res);
});

router.delete("/",  multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.AdminPromoCodeController.update, payload, req, res);
});

module.exports = router;