const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let message = require("../../config/messages");
let Services = require("../../services");
const Sequelize = require("sequelize");
module.exports = {
	saveCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			name: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToSave = {};
		if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
		let create = await Services.CategoriesService.saveDataCategories(objToSave);
		if (create) {
			return message.success.ADDED;
		}
	},
	getListCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		let projection=["id","name","isBlocked","createdAt",
			[Sequelize.literal("(select count(sub_categories.id) from sub_categories where sub_categories.categoryId= categories.id AND isDeleted=\"0\" AND isBlocked=\"0\")"), "subCategoryCount"]];
		result.count= 	await Services.CategoriesService.countCategories(payload);
		result.data = await Services.CategoriesService.getCategories(
			payload,projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		return result;
	},
	getDetailCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let projection=["id","name","isBlocked","createdAt","name",
			[Sequelize.literal(`(select count(sub_categories.id) from categories as categories inner join sub_categories as sub_categories on categories.id = sub_categories.categoryId where categoryId='${payload.id}' AND sub_categories.isDeleted="0" AND sub_categories.isBlocked="0")`), "subCategoryCount"]
		];
		let detail = await Services.CategoriesService.getOneCategories(criteria,projection);
		return detail;
	},
	updateCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			name: Joi.string().optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let subCategoryDelete= {
			categoryId : payload.id
		};
		let objToSave = {};
		if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payloadData.name;
		if (_.has(payloadData, "isDeleted")) objToSave.isDeleted = payloadData.isDeleted;
		if (_.has(payloadData, "isBlocked") ) objToSave.isBlocked = payloadData.isBlocked;

		await Services.CategoriesService.updateDataCategories(criteria, objToSave);
		if (!payload.isBlocked){
			await Services.CategoriesService.updateDataSubCategories(subCategoryDelete,{isDeleted:1});
		} else if(payload.isBlocked){
			await Services.CategoriesService.updateDataSubCategories(subCategoryDelete,{isBlocked:1});
		}
		return message.success.UPDATED;
	},

	saveSubCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			name: Joi.string().required(),
			categoryId: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToSave = {};
		if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payload.name;
		if (_.has(payloadData, "categoryId") && payloadData.categoryId != "") objToSave.categoryId = payload.categoryId;
		let create = await Services.CategoriesService.saveDataSubCategories(objToSave);
		if (create) {
			return message.success.ADDED;
		}
	},
	getListSubCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			categoryId: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result= {};
		result.data = await Services.CategoriesService.getListingSubCategories(
			payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		result.count= 	await Services.CategoriesService.countSubCategories(payload);
		return result;
	},
	getDetailSubCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let detail = await Services.CategoriesService.getOneSubCategories(criteria);
		return detail;
	},
	updateSubCategories: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			name: Joi.string().optional(),
			categoryId: Joi.string().optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		let objToSave = {};
		if (_.has(payloadData, "name") && payloadData.name != "") objToSave.name = payloadData.name;
		if (_.has(payloadData, "isDeleted")) objToSave.isDeleted = payloadData.isDeleted;
		if (_.has(payloadData, "isBlocked") ) objToSave.isBlocked = payloadData.isBlocked;
		if (_.has(payloadData, "categoryId") && payloadData.categoryId != "") objToSave.categoryId = payloadData.categoryId;
		await Services.CategoriesService.updateDataSubCategories(criteria, objToSave);
		return message.success.UPDATED;
	},
};