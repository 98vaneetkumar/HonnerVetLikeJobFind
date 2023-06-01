"use strict";
//const _ = require("underscore");
//const Sequelize = require("sequelize");
//const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
//const baseService = require("./base");


/**
 * ######### @function getDetail ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve users ########
 */
exports.getDetail = (criteria, projection) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		Models.UserDocuments.findOne({ where: criteria,
			attributes: projection })
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = [["id", "DESC"]];
		Models.UserDocuments.findAll({
			limit,
			offset,
			where: criteria,
			attributes: projection,
			order: order
		}).then(result => {
			resolve(result);
		}).catch(function (err) {
			console.log(err);
			reject(Response.error_msg.implementationError);
		});
	});
};

/**
 * ######### @function saveData ########
 * ######### @params => criteria, user data ########
 * ######### @logic => Used to create users ########
 */
exports.saveData = (data) => {
	return new Promise((resolve, reject) => {
		Models.UserDocuments.create(data)
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

/**
 * ######### @function updateData ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update users ########
 */
exports.updateData = (criteria, objToSave) => {
	return new Promise((resolve, reject) => {
		Models.UserDocuments.update(objToSave, { where: criteria })
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

/**
 * #########    @function count         ########
 * #########    @params => criteria          ########
 * #########    @logic => Used to count users #######
 */
exports.count = (criteria) => {
	let where = criteria;
	return new Promise((resolve, reject) => {
		Models.UserDocuments.count({
			where: where
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

/**
 * ######### @function delete                               ########
 * ######### @params => criteria                            ########
 * ######### @logic => Used to delete user delete      ########
 */
exports.deleteUserDelete = (criteria) => {
	return new Promise((resolve, reject) => {
		Models.UserDocuments.destroy({
			where: criteria
		})
			.then(result => {
				resolve(result);
			}).catch(function (err) {
				console.log(err); reject(Response.error_msg.implementationError);
			});
	});
};
