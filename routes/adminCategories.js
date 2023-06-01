var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const sendResponse = require("../helpers/sendResponse");
var multiPart = require("connect-multiparty");
var multiPartMiddleware = multiPart();

router.post("/saveCategory", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.saveCategories, req.body, req, res);
});

router.get("/getCategories", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.getListCategories, payload, req, res);
});

router.get("/categoryDetail/:id",  (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.getDetailCategories, req.params, req, res);
});

router.put("/updateCategory", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.updateCategories, req.body, req, res);
});

router.delete("/deleteCategory", authentication, multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.updateCategories, payload, req, res);
});



router.post("/saveSubCategory", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.saveSubCategories, req.body, req, res);
});

router.get("/getSubCategories", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.getListSubCategories, payload, req, res);
});

router.get("/subCategoryDetail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.getDetailSubCategories, req.params, req, res);
});

router.put("/updateSubCategory", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.updateSubCategories, req.body, req, res);
});

router.delete("/deleteSubCategory", authentication, multiPartMiddleware, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(Controllers.AdminCategoriesController.updateSubCategories, payload, req, res);
});

module.exports = router;