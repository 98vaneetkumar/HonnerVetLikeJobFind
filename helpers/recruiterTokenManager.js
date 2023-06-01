"use strict ";
var Jwt = require("jsonwebtoken");
var Service = require("../services");
const Response = require("../config/response");
const messages = require("../config/messages");
// const env = require("../config/env")();
// const PRIVATE_KEY = env.APP_URLS.PRIVATE_KEY;
var setTokenInDB = async (recruiterId, userType, token) => {
	var dataToSave = {
		recruiterId: recruiterId,
		deviceToken: userType.deviceToken,
		accessToken: token,
	};
	let condition = {
		recruiterId: recruiterId,
		deviceToken: userType.deviceToken,
	};
	await Service.RecruiterSessionService.deleteSessions(condition);
	let createSession = await Service.RecruiterSessionService.saveSessionData(dataToSave);
	if (!createSession) throw Response.error_msg.implementationError;
};
var expireTokenInDB = async (recruiterId) => {
	let condition = {
		recruiterId: recruiterId,
	};
	return await Service.RecruiterSessionService.deleteSessions(condition);
};
var setToken = (tokenData, callback) => {
	if (!tokenData.id) {
		callback(Response.error_msg.implementationError);
	} else {
		// var tokenToSend = Jwt.sign(tokenData, PRIVATE_KEY);
		setTokenInDB(tokenData.id, tokenData.type, tokenToSend);
		callback(null, { accessToken: tokenToSend });
	}
};

var generateToken = async (userData) => {
	let tokenData = {
		email: userData.email || "",
		id: userData.id,
	};

	let token = await Jwt.sign(tokenData, privateKey);
	setTokenInDB(userData.id, "", token);

	return token;
};
var expireToken = (token, callback) => {
	expireTokenInDB(token.id);
	callback(null, messages.success.LOGOUT);
};
module.exports = {
	setTokenInDB:setTokenInDB,
	expireToken: expireToken,
	setToken: setToken,
	generateToken: generateToken,
};
