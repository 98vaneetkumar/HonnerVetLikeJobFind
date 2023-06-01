"use strict";
const Sequelize = require("sequelize");
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

/**
 * ######### @function getDetail ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve users ########
 */
exports.getSessionDetail = (criteria, projection) => {
	if ("notInId" in criteria) {
		criteria.id != criteria.notInId;
		delete criteria.notInId;
	}
	return new Promise((resolve, reject) => {
		Models.RecruiterSessions.findOne({ where: criteria, attributes: projection })
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("aaaaaaaaaaa", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getSessionList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = "";
		order = [[Sequelize.literal("id Desc")]];
		Models.RecruiterSessions.findAll({
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
exports.getSessionDeviceToken = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = "";
		order = [[Sequelize.literal("id Desc")]];
		Models.RecruiterSessions.findAll({
			limit,
			offset,
			where: criteria,
			distinct:true,
			col:"deviceToken",
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
exports.saveSessionData = async (objToSave) => {
	return await baseService.saveData(Models.RecruiterSessions, objToSave);
};
/**
 * ######### @function updateData ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update users ########
 */
exports.updateSessionData =async (criteria, objToSave) => {
	return await baseService.updateData(Models.RecruiterSessions, criteria, objToSave);
};
/**
 * #########    @function deleteSessions         ########
 * #########    @params => criteria           ########
 * #########    @logic => Used to delete sessions #######
 */
exports.deleteSessions = async(criteria) => {
	return await baseService.delete(Models.RecruiterSessions, criteria);	
};
