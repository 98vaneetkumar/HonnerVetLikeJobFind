"use strict";
const Models = require("../models");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.UserTurnOffNotification, objToSave);
};
