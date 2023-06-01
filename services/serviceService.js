"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.Services, objToSave);
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.Services, criteria, objToSave);
};

exports.count = async (criteria) => {
	let where = {};
	if (criteria && criteria.search) {
		where = {
			name: {
				[Op.like]: "%" + criteria.search + "%"
			}
		};
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.Services, where);
};

exports.getOne = async (criteria) => {
	return await baseService.getSingleRecord(Models.Services, criteria);
};

exports.getListing = (criteria, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["isOrderBy", "ASC"], ["name", "ASC"] 
		];
		if (criteria.sortBy && criteria.orderBy) {
			order = [
				[criteria.sortBy, criteria.orderBy]
			];
		}
		if (criteria && criteria.search) {
			where = {
				name: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.Services
			.findAll({
				limit,
				offset,
				where: where,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getSessionList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let order = "";
		order = [[Sequelize.literal("id Desc")]];
		Models.Sessions.findAll({
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