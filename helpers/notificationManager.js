var admin = require("firebase-admin");
var serviceAccount = require("../config/honorvet-firebase-message-sdk.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
const env = require("../config/env")();
var twilio = require("twilio");
const accountSid = env.TWILIO.accountSid; // Your Account SID from www.twilio.com/console
const authToken = env.TWILIO.authToken;   // Your Auth Token from www.twilio.com/console
const authPhoneNo = env.TWILIO.accountPhone; 
var  client = new twilio(accountSid, authToken); 
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
		console.log("message----", message);
		let result = await sendFirebaseAdmin(message);
		console.log("result:::::",result);
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
		let result = await sendFirebaseAdmin(message);
		console.log("result:::::",result);
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
		
		console.log("message----", message);
		let result = await sendFirebaseAdmin(message);
		console.log("result:::::",result);
	},
	sendNotificationIos:  async (data, deviceTokensArr ) => {
		let message = "";
		if (Array.isArray(deviceTokensArr)) {
			message = {
				tokens: deviceTokensArr, 
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
				tokens: deviceTokensArr, 
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
		console.log("message:  ", message);
		let result = await sendFirebaseAdmin(message);
		console.log("result:::::",result);
	},
	sendNotificationAndroid: async (body, deviceTokensArr) => {
		let message = {};
		if (Array.isArray(deviceTokensArr)) {
			message = {
				tokens: deviceTokensArr,
				notification: {title: body.title, body: body.message},
				data : body, 
			};
		} else {
			message = {
				tokens: deviceTokensArr, // single device token
				notification: {title: body.title, body: body.message},
				data : body,
			};
		}
		console.log("message:  ", message);
		let result = await sendFirebaseAdmin(message);
		console.log("result:::::",result);
	},
	sendNotificationAll:  async (data, deviceTokensArr) => {
		var message = {
			tokens: deviceTokensArr,
			collapse_key: "your_collapse_key",
			priority: "high",
			notification: {
				title: data.title,
				body: data.message,
				sound: "default",
				badge: "1",
				notificationType: data.notificationType,
				message: data.message,
			},
			data: data,
		};
		
		console.log("message:  ", message);
		let result = await sendFirebaseAdmin(message);
		console.log("result:::::",result);
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

function sendFirebaseAdmin(payload) {
	return new Promise((resolve, reject) => {
		admin.messaging().sendMulticast(payload).then((response) => {
			resolve(response);
		}).catch((error) => {
			reject(error);
		});
	});
}

