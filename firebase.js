"use strict";
var Services = require("./services");
var NotificationManager = require("./helpers/notificationManager");
const env = require("./config/env")();
let Models = require("./models");
const { Op } = require("sequelize");
// const UniversalFunctions = require("./config/response");
// var async = require("async");

var firebase = require("firebase/compat/app");
require("firebase/compat/database");
require("firebase/compat/auth");

const config = {
	apiKey: "AIzaSyAU-cMiU58AdE_xQRk1N69Dy6S0VxPYKMo",
	authDomain: "honorvet-cb626.firebaseapp.com",
	databaseURL: "https://honorvet-cb626-default-rtdb.firebaseio.com",
	projectId: "honorvet-cb626",
	storageBucket: "honorvet-cb626.appspot.com",
	messagingSenderId: "1044983158863",
	appId: "1:1044983158863:web:35b1bde9ba85f0ead5f23a",
	measurementId: "G-PVC4ZG1HX9"
};
firebase.initializeApp(config);

console.log("firebase:::",firebase.apps);
var app ;
if (!firebase.apps.length) {
	app = firebase.initializeApp({
		databaseURL: "https://honorvet-cb626-default-rtdb.firebaseio.com",
	});
} else{
	app = firebase;
}
console.log("app:::: ",app);
var db = app.database();
var ref = db.ref(env.CHATTABLE.notifications);
console.log("env.CHATTABLE.notifications::::",env.CHATTABLE.notifications);

// firebase.auth().signInWithEmailAndPassword("", "")
// 	.then((userCredential) => {
// 		// Signed in
// 		var user = userCredential.user;
// 		console.log("user:::::",user);
/////////////////////
ref.on("child_added", async function(notifications) {
	// var type = 4;
	var notification = notifications.val();
	console.log("check::::::", notification);
	// var key_value = notifications.key;
	// console.log("key_value: ", key_value);
	var created_at = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
	let receiverIds = notification["receiver_id"];
	let objToSave = {
		chatDialogId 	: notification["chat_dialog_id"],
		firebaseMessageTime : notification["firebase_message_time"],
		message 		: notification["message"],
		messageId		: notification["message_id"],
		// messageStatus	: notification["message_status"],
		messageTime		: notification["message_time"],
		messageType		: notification["message_type"],
		senderId		: notification["sender_id"],
		receiverId		: notification["receiver_id"],
		// is_delete		: JSON.stringify(notification["is_delete"]),
		attachmentUrl	: notification["attachment_url"],
		// is_star			: JSON.stringify(notification["is_star"]),
		createdAt		: created_at,
		// reply_id:   notification["reply_id"],
		// reply_msg:  notification["reply_msg"],
		// reply_type: notification["reply_type"]
	};
	console.log("receiverIds:  ", receiverIds,  "\nobjToSave:   ", objToSave);
	let getMessage = await Services.ChatService.getMessages(
		{ messageId:  notification["message_id"]},
		["id","messageId"]);
	//console.log('getMessage.length',getMessage.length);
	// if(!receiverIds) receiverIds = [];
	if(getMessage && getMessage.length==0){
		let createChat = await Services.ChatService.saveData(objToSave);
		console.log("createChat: ", createChat);
		// let receiverIdArrKey = Object.keys(receiverIds);
		// for(let i=0; i<(receiverIdArrKey.length); i++){
		if(notification["sender_id"] !== receiverIds){
			let saveVal = {
				senderId: notification["sender_id"],
				receiverId: receiverIds,
				messageId: notification["message_id"],
				chatDialogId: notification["chat_dialog_id"]
			};
			let createMember = await Services.ChatService.saveReceiverData(saveVal);
			console.log("createMember: ", createMember);
		}
		// }
				
		//console.log('createChat:::',createChat);
	
		// // if(!receiverIds) receiverIds = [];

		// // // ////////////////////// Notification ////////
		// // console.log("=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \nreceiverArrId:=>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ", receiverArrId);
		if(receiverIds) {
			let criteriaAnd = {};
			criteriaAnd.userId =  {
				[Op.and] : {
					[Op.eq]: receiverIds,
					[Op.ne]: notification["sender_id"]
				}
			};
			criteriaAnd.deviceType = "ANDROID";

			let androidUser = await Services.ChatService.getUserDevice(
				criteriaAnd, ["id","deviceToken", "accessToken", "userId"]);

			console.log("androidUser:  ", androidUser);

			var deviceTokenArray = [];
			if(androidUser.length > 0) {
				for (var i = 0; i < androidUser.length; i++) {
					if(androidUser[i].deviceToken!=="abc"){
						deviceTokenArray.push(androidUser[i].deviceToken);
					}
				}
			}

			let criteriaIos = {};
			criteriaIos.userId =  {
				[Op.and] : {
					[Op.eq]: receiverIds,
					[Op.ne]: notification["sender_id"]
				}
			};
			criteriaIos.deviceType = "IOS";
			let iosUser = await Services.ChatService.getUserDevice(
				criteriaIos,
				["id","deviceToken", "accessToken", "userId"]);
			var deviceTokenArrayIos = [];
			if(iosUser.length > 0) {
				for (let j = 0; j < iosUser.length; j++) {
					if(iosUser[j].deviceToken!=="abc"){
						deviceTokenArrayIos.push( iosUser[j].deviceToken);
					}
				}
			}
			let criteriaWeb = {};
			criteriaWeb.userId =  {
				[Op.and] : {
					[Op.eq]: receiverIds,
					[Op.ne]: notification["sender_id"]
				}
			};
			criteriaWeb.deviceType = "WEB";
			let webUser = await Services.ChatService.getUserDevice(
				criteriaWeb,
				["id","deviceToken", "accessToken", "userId"]);
			var deviceTokenArrayWeb = [];
			if(webUser.length > 0) {
				for (let j = 0; j < webUser.length; j++) {
					if(webUser[j].deviceToken!=="abc"){
						deviceTokenArrayWeb.push(webUser[j].deviceToken);
					}
				}
			}
			let senderDetails = await Services.BaseService.getSingleRecord(Models.Users, { id: notification["sender_id"] }, ["id", "name"]);
			console.log("senderDetails::",senderDetails);
			let senderName = "";
			if(senderDetails) {
				senderName = senderDetails.name || "";
				console.log("senderName:::",senderName);
			}else{
				let jobInfo = await Services.BaseService.getSingleRecord(Models.JobPosts, { id: notification["sender_id"] }, ["id", "jobTitle","recuiterId"]);
				if(jobInfo){
					let senderInfo = await Services.BaseService.getSingleRecord(Models.Recruiter, { id: jobInfo["recuiterId"] }, ["id", "name"]);
					console.log("senderInfo::",senderInfo);
					if(senderInfo) {
						senderName = senderInfo.name || "";
					}
				}
			}
			let dataToSend = {
				chatDialogId: notification["chat_dialog_id"],
				message: notification["message"],
				title: senderName || "", // sender name or group name'
				messageType: notification["message_type"].toString(),
				attachmentUrl: notification["attachment_url"],
				// replyMessage: notification["reply_msg"],
				// replyType: notification["reply_type"],
				notificationType: "51"
			};
			if(notification["message_type"] === 2) {
				dataToSend.message = "Image";
			} else if(notification["message_type"] === 4) {
				dataToSend.message = "Profile Shared";
			} else {
				dataToSend.message = notification["message"];
			}
			console.log("dataToSend:  ", dataToSend, "\ndeviceTokenArray:  ", deviceTokenArray, "\ndeviceTokenArrayIos:  ", deviceTokenArrayIos);

			if(deviceTokenArray.length > 0) {
				await NotificationManager.sendNotificationAndroid(dataToSend, deviceTokenArray);
			}
			if(deviceTokenArrayIos.length > 0) {
				await NotificationManager.sendNotificationIos(dataToSend, deviceTokenArrayIos);
			}
			if(deviceTokenArrayWeb.length > 0) {
				await NotificationManager.sendNotificationIos(dataToSend, deviceTokenArrayWeb);
			}
			const chatDialogIdArr = notification["chat_dialog_id"].split(",");
			//console.log("receiverIds>>>>>>>>>>>>>", receiverIds);
			if (receiverIds === chatDialogIdArr[0]) {
				// console.log("case0 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				// console.log("receiverIds>>>>>>>>>>>>>", receiverIds);
				// console.log("chatDialogIdArr[0]>>>>>>>>>>>>>", chatDialogIdArr[0]);
				let criteriaJob={
					id:chatDialogIdArr[0],
					isDeleted:0
				};
				var projectionJob=["id","isBlocked","isDeleted","jobTitle","recuiterId"];
				let getJobDetail = await Services.JobPostService.getSingleRecord(criteriaJob,projectionJob);
				if(getJobDetail){
					let getAllRecruiterDeviceToken = await Services.RecruiterSessionService.getSessionList({recruiterId: chatDialogIdArr[0]}, ["deviceToken"], 50, 0);
					console.log(getAllRecruiterDeviceToken, "getAllRecruiterDeviceTokengetAllRecruiterDeviceToken");

					var arrRecruiterDeviceTokenWEB = [];
					getAllRecruiterDeviceToken.forEach(async (element) => {
						arrRecruiterDeviceTokenWEB.push(element.deviceToken);
					});
					// let dataNotification ={
					// 	title:"Welcome APP",
					// 	message:"Welcome to the HonorVet Hiring App!",
					// 	notificationType:1,
					// 	flag:1,
					// 	notificationId : 1,
					// };
					if(arrRecruiterDeviceTokenWEB.length > 0){
						await NotificationManager.sendNotificationIos(dataToSend, arrRecruiterDeviceTokenWEB);
					}
				}
			}
			if (receiverIds === chatDialogIdArr[1]) {
				// console.log("case1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				// console.log("receiverIds>>>>>>>>>>>>>", receiverIds);
				// console.log("chatDialogIdArr[0]>>>>>>>>>>>>>", chatDialogIdArr[1]);
				let getAllDeviceToken = await Services.SessionsService.getSessionList({userId: chatDialogIdArr[1]}, ["deviceToken", "deviceType" ], 50, 0);
				// console.log(getAllDeviceToken, "getAllDeviceToken>>>>>>.");
				var arrDeviceTokenIOS = [];
				var arrDeviceTokenANDRIOD = [];
				var arrDeviceTokenWEB = [];
				getAllDeviceToken.forEach(async (element) => {
					if(element.deviceType === "IOS"){
						arrDeviceTokenIOS.push(element.deviceToken);
					}else if(element.deviceType === "ANDROID"){
						arrDeviceTokenANDRIOD.push(element.deviceToken); 
					}else if(element.deviceType === "WEB"){
						arrDeviceTokenWEB.push(element.deviceToken); 
					}
				});
				// let dataNotification ={
				// 	title:"Welcome APP",
				// 	message:"Welcome to the HonorVet Hiring App!",
				// 	notificationType:1,
				// 	flag:1,
				// 	notificationId : 1,
				// };
				if(arrDeviceTokenANDRIOD.length > 0){
					await NotificationManager.sendNotificationAndroid(dataToSend, arrDeviceTokenANDRIOD);
				}
				if(arrDeviceTokenIOS.length > 0){
					await NotificationManager.sendNotificationIos(dataToSend, arrDeviceTokenIOS);
				}
				if(arrDeviceTokenWEB.length > 0){
					await NotificationManager.sendNotificationAndroid(dataToSend, arrDeviceTokenWEB);
				}
			}
			var key_value = notifications.key;	
			console.log('key_value:::::',key_value);
			setTimeout(() => { ref.child(key_value).remove(); }, 1000);
			
		}

	}
	//////////////////////////////////////////////

}, function (errorObject) {
	console.log("errorObject::::",errorObject);
});
////////////////////////
// ...
// })
// .catch((error) => {
// 	//console.log('user:::::error',error);
// 	console.log("error.code:  ", error.code);
// 	console.log("error.message:  ", error.message);
// });

//var msg_ref = db.ref("ReadStatus");


/*msg_ref.on("child_added", function(notifications) {
	var notification = notifications.val();
	console.log("notification::::::",notification);
	var key_value = notifications.key;	
	console.log('key_value:::::',key_value);
	msg_ref.child(key_value).remove();
});*/

module.exports = {
	db : db
};