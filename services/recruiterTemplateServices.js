"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.Templates, objToSave);
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.Templates, criteria, objToSave);
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
	if(criteria && criteria.recruiterId){
		where.recuiterId=criteria.recruiterId;
	}
	where.isDeleted = 0;
	where.isBlocked = 0;
	return await baseService.count(Models.Templates, where);
};

exports.getOne = async (criteria) => {
	return await baseService.getSingleRecord(Models.Templates, criteria);
};

exports.getListing = (criteria, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};		
		let order = [
			["createdAt", "DESC"]
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
		if(criteria && criteria.recruiterId){
			where.recuiterId=criteria.recruiterId;
		}
		where.isDeleted = 0;
		where.isBlocked = 0;
		Models
			.Templates
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
