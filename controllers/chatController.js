const Joi = require("joi");
let commonHelper = require("../helpers/common");
let Services = require("../services");

module.exports = {
	deleteMessage: async (payloadData) => {
		const schema = Joi.object().keys({
			messageIds: Joi.array().items(Joi.string()).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

		let messageId = payload.messageIds;
		// let criteria = {
		// 	messageId: payload.messageIds,
		// };
		for (let i=0; i< messageId.length;i++) {
			let saveObj = {
				userId: payloadData.id,
				messageId:messageId[i]
			};
			await Services.ChatService.saveDataToDelete(saveObj);
		}
		let res = {};
		return res;
	},
	clearChat: async (payloadData) => {
		const schema = Joi.object().keys({
			messageId: Joi.string().required()
		});

		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let lastMessageCreationDate = await Services.ChatService.getMessageDetails({messageId: payload.messageId}, ["id", "createdAt"]);
		if(lastMessageCreationDate) {
			let checkClearChatExists = await Services.ChatService.getClearChat({userId: payloadData.id}, ["id"]);
			if(checkClearChatExists) {
				await Services.ChatService.updateClearChat({userId: payloadData.id}, {chatClearDate: lastMessageCreationDate.createdAt});
			}
			else {
				await Services.ChatService.clearChat({userId: payloadData.id, chatClearDate: lastMessageCreationDate.createdAt});
			}
		}
	},
	getChatHistory: async(payloadData) => {
		console.log("payloadData: ", payloadData);
		let chatClearedDate = await Services.ChatService.getClearChat({userId: payloadData.id}, ["id", "chatClearDate"]);
		let criteria = {
			userId: payloadData.id
		};
		if(chatClearedDate) {
			criteria.chatClearedDate = chatClearedDate.chatClearDate;
		}

		let chatHistory = await Services.ChatService.getChatHistory(criteria, []);
		return chatHistory;
	}
};