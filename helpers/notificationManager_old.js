const env = require("../config/env")();
// const appConstants = require("../config/appConstants");
var FCM = require("fcm-node");
var fcm = new FCM(env.FCM.SERVER_KEY);
var twilio = require("twilio");
const accountSid = env.TWILIO.accountSid; // Your Account SID from www.twilio.com/console
const authToken = env.TWILIO.authToken;   // Your Auth Token from www.twilio.com/console
const authPhoneNo = env.TWILIO.accountPhone; 
var  client = new twilio(accountSid, authToken); 
// let Service = require("../services");
// const Models = require("../models");


module.exports = {
	sendFirebase: async (userId, title, body, type, info, id, flag) => {
		let message = {};
		if (Array.isArray(userId)) {
			message = {
				registrationids: userId,
				notification: {
					title: title,
					body: body,
					type: type
				},
				data: {
					title: title,
					body: body,
					type: type,
					message: body,
					id: id,
				}
			};
		} else {
			message = {
				to: userId, // single device token
				notification: {
					title: title,
					body: body,
					type: type
				},
				data: {
					title: title,
					body: body,
					type: type,
					message: body,
					id: id,
				}
			};
		}
		if (info && !(Array.isArray(info)) && info !== "") {
			message.data.id = info;
		}
		if (!flag) {
			message.data.flag = 1;
		}
		else {
			message.data.flag = 2;
		}
		sendFcm(message, function (err, data) {
			console.log(err, data);
		});
	},
	adminSendFirebase: async (userId, title, body, type, info, cb) => {
		let message = {};
		if (Array.isArray(userId)) {
			message = {
				registrationids: userId, // multiple token in array
				notification: {
					title: title,
					body: body,
					type: type
				},
				data: {
					title: title,
					body: body,
					type: type
				}
			};
		} else {
			message = {
				to: userId, // single device token
				notification: {
					title: title,
					body: body,
					type: type
				},
				data: {
					title: title,
					body: body,
					type: type
				}
			};
		}
		if (info && !(Array.isArray(info)) && info !== "") {
			message.data.id = info;
		}
		console.log("message----", message);
		sendFcm(message, function (err, data) {
			console.log(err, data);
			return cb(null, { status: 1, data: data });
		});
	},
	sendPushNotification: async (title, body, type,topic_id) => {
		var message;
		let topic;
		if (type == 0) {
			topic = "/topics/DEV_USER_" + topic_id;              //  type defines user types
		}
		if (type == 1) {
			topic = "/topics/";
			message = {
				to: topic,                                                  // either DeviceRegistrationToken or topic1
				data: body,
			};
		}
		if (type == 2) {
			topic = "/topics/";
			if (topic_id ==2) {
				message = {
					to: topic, // either DeviceRegistrationToken or topic1
					content_available: true,
					notification: body,
					data: {
						flag: body.flag,
					}
				};
			} else{
				message = {
					to: topic, // either DeviceRegistrationToken or topic1
					notification: body,
					data: {
						flag: body.flag,
					}
				};
			}
		}
		/*if (info && !(Array.isArray(info)) && info !== "") {
      message.data.id = info;
    }*/
		sendFcm(message, function (err, data) {
			console.log(err, data);
			return console.log("Message sent");
		});
	},
	sendNotificationAndroid: async (body, deviceTokensArr) => {
		let message = {};
		if (Array.isArray(deviceTokensArr)) {
			message = {
				registration_ids: deviceTokensArr,
				notification: {title: body.title, body: body.message},
				data : body, 
			};
		} else {
			message = {
				to: deviceTokensArr, // single device token
				notification: {title: body.title, body: body.message},
				data : body,
			};
		}
		sendFcm(message, function (err, data) {
			console.log(err, data);
		});
	},
	sendNotificationIos:  async (data, deviceTokensArr ) => {
		let message = "";
		if (Array.isArray(deviceTokensArr)) {
			message = {
				registration_ids: deviceTokensArr, 
				priority: "high",
				content_available: true,
				mutable_content: true,
				notification: {
					"notificationType": data.notificationType,
					"title": data.title,
					"body": data.message,
					"message": data.message,
					"data" : data,
					"sound": "default",
					"content-available" : true
				}
			};
		}else{
			message = {
				to: deviceTokensArr, 
				priority: "high",
				content_available: true,
				mutable_content: true,
				notification: {
					"notificationType": data.notificationType,
					"title": data.title,
					"body": data.message,
					"message": data.message,
					"data" : data,
					"sound": "default",
					"content-available" : true
				}
			};
		}
		sendFcm(message, function (err, response) {
			console.log("ios notification check");
			console.log(err, response);
		});
	},
	sendNotificationAll:  async (data, deviceTokensArr) => {
		var message = {
			registration_ids: deviceTokensArr,
			collapse_key: "your_collapse_key",
			priority: "high",
			notification: {
				title: data.title,
				body: data.message,
				sound: "default",
				badge: 1,
				notificationType: data.notificationType,
				message: data.message,
			},
			data: data,
		};
		sendFcm(message, function (err, response) {
			console.log("web notification check");
			console.log(err, response);
		});
	},
	sendSms: async (req)=>{
		try{
			await client.messages.create({  
				body: req.otp,
				to: req.phoneNumber,//  // Text this number
				from: authPhoneNo // From a valid Twilio number
			});
			return true;
		}
		catch(err){
			console.log(err);
			throw new Error(err);
		}
	},
	
};

function sendFcm(message, cb) {
	fcm.send(message, function (err, messageId) {
		console.log(err, messageId);
		if (err) {
			console.log("err>>>>>>>>>>>>>", err);
			cb("Something has gone wrong!", err);
		} else {
			cb(null, "Sent with message ID: ", messageId);
		}
	});
}
