const Jwt = require("jsonwebtoken");
const Services = require("../services");
const env = require("../config/env")();
const response = require("../config/response");
const Models = require("../models");

const verifyToken = async(req, res, next) => {
	if (req.headers && req.headers.authorization) {
		var token = req.headers.authorization;
		token = token.replace("Bearer ", "");
		let tokenData = await Jwt.verify(token, env.APP_URLS.PRIVATE_KEY);
		console.log(tokenData);
		let userSession = await Services.SessionsService.getSessionDetail({
			"userId": tokenData.id,
			"accessToken": token
		}, ["id"]);
		if (!userSession) {
			return res.status(401).json({
				statusCode: 401,
				message: "Someone else is logged in on another device with this account.",
			});
		} else {
			let criteria = {
				"id": tokenData.id,
				"isDeleted": "0",
			};
			let projection = ["id", "email", "isBlocked"];
			let userData = await Services.BaseService.getSingleRecord(Models.Users, criteria, projection);
			if (userData) {
				if (userData && userData.isBlocked === 1) {
					return res.status(401).json({
						statusCode: 401,
						message: "Your account has been blocked by the Admin. Please contact support@support.com.",
					});
				} else {
					req.credentials = tokenData;
					req.credentials.accessToken = req.headers.authorization;
					await next();
				}
			} else {
				return res.status(401).json({
					statusCode: 401,
					message: "The token is not valid or User not Found!",
				});
			}
		}
	} else {
		return res.status(401).send(response.error_msg.invalidToken);
	}
};
module.exports = {
	verifyToken: verifyToken
};