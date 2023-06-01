var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/authentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");


//apply job
router.post("/apply", authentication, (req, res) => {
	let payload=req.body||{};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserJobController.ApplyJob, req.body, req, res);
});

router.get("/apply",authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserJobController.getListOfApplyJob, payload, req, res);
});

router.get("/apply/detail/:id",authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UserJobController.getDetailOfApplyJob, req.params, req, res);
});

router.put("/apply", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UserJobController.updateApplyJob, req.body, req, res);
});

router.delete("/apply", authentication, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserJobController.deletedApplyJob, payload, req, res);
});

//Save job
router.post("/save", authentication, (req, res) => {
	let payload=req.body||{};
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserJobController.saveJob, req.body, req, res);
});

router.get("/save",authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserJobController.getListOfSaveJob, payload, req, res);
});

router.get("/save/detail/:id",authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UserJobController.getDetailOfSaveJob, req.params, req, res);
});

router.put("/save", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UserJobController.updateSaveJob, req.body, req, res);
});

router.delete("/save", authentication, (req, res) => {
	let payload = req.body;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UserJobController.deleteSaveJob, payload, req, res);
});

//This is for get detail of jobs

router.get("/JobsList",authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.JobPostController.getList, payload, req, res);
});

router.get("/JobsList/:id",authentication, (req, res) => {
	let payload = req.params;
	payload.userId = req.credentials.id;
	return sendResponse.executeMethod(Controllers.JobPostController.getDetail, payload, req, res);
});


router.get("/companyPostJob/:id",authentication, (req, res) => {
	let payload = req.query;
	payload.id=req.params.id;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	// payload.userId=req.credentials.id;
	return sendResponse.executeMethod(Controllers.JobPostController.getPostDetail, payload, req, res);
});

//List of apply job for specific post

router.get("/:id",authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UserJobController.getDetailOfApplyJobForSpeificPost, req.params, req, res);
});




module.exports = router;