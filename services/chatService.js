"use strict";
const _ = require("underscore");
const Models = require("../models");
const Response = require("../config/response");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


exports.saveData = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models
			.Chats
			.create(objToSave)
			.then((result) => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveDataToDelete = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models
			.ChatDeletes
			.create(objToSave)
			.then((result) => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveReceiverData = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models
			.ChatMembers
			.create(objToSave)
			.then((result) => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getMessages = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [
			["createdAt", "DESC"]
		];
		if(_.has(criteria,"messageId")){
			where.messageId = criteria.messageId;
		}
		Models
			.Chats
			.findAll({
				where: where,
				attributes: projection,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.updateData = (criteria, objToSave,) => {
	return new Promise((resolve, reject) => {
		Models
			.Chats
			.update(objToSave, { where: criteria })
			.then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getMessageDetails = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models
			.Chats
			.findOne({
				where: criteria,
				attributes: projection
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.updateClearChat = (criteria, objToUpdate) => {
	return new Promise((resolve, reject) => {
		Models
			.ClearChat
			.update(objToUpdate, {
				where: criteria
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.clearChat = (objToSave) => {
	return new Promise((resolve, reject) => {
		Models
			.ClearChat
			.create(objToSave)
			.then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getClearChat = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models
			.ClearChat
			.findOne({
				where: criteria,
				attributes: projection
			})
			.then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getUserDevice = (criteria, projection) => {
	
	return new Promise((resolve, reject) => {
		Models
			.Sessions
			.findAll({
				where: criteria,
				attributes: projection
			})
			.then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getChatHistory = (criteria, projection) => {
	console.log("projection: ", projection);
	let where = {};
	if(criteria.chatClearedDate) {
		where.createdAt = {
			[Op.gt]: criteria.chatClearedDate
		};
	}
	if(criteria && criteria.chatDialogId)  where.chatDialogId = criteria.chatDialogId;
	where.messageId = {
		[Op.in]: Sequelize.literal(`(SELECT messageId from chat_members where (senderId="${criteria.userId}" OR receiverId="${criteria.userId}") AND messageId NOT IN((SELECT messageId from chat_deletes where userId="${criteria.userId}")))`)
	};
	
	return new Promise((resolve, reject) => {
		Models
			.Chats
			.findAll({
				where: where
			})
			.then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};