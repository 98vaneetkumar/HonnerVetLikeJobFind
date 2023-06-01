var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
const authentication = require("../middleWares/authentication").verifyToken;

router.put("/deleteMessage", authentication, async(req, res) => {
	let payload = req.body;
	payload.id = req.credentials.id;

	return sendResponse.executeMethod(Controllers.ChatController.deleteMessage, payload, req, res);
});

router.post("/clearChat", authentication, async(req, res) => {
	console.log("req.body::::",req.body);
	let payload = req.body;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controllers.ChatController.clearChat, payload, req, res);
});

router.get("/chatHistory", authentication, async(req, res) => {
	console.log("req.query::::",req.query);
	let payload = req.query;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controllers.ChatController.getChatHistory, payload, req, res);
});

module.exports = router;