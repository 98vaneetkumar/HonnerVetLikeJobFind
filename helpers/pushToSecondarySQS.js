"use strict";
const AWS = require("aws-sdk");
const env = require("../config/env")();

exports.sendMessage = async (action, method, data) => {
	console.log("Notification data via SQS");
	if (action && action.length > 0) {
		console.log("action------", action);
		console.log("method------", method);
		console.log("data------", data);
		try {
			console.log("SQS Config", env.AWS.SQS.secondaryTasks);
			var sqs = new AWS.SQS({
				region: env.AWS.awsRegion,
				accessKeyId: env.AWS.accessKeyId,
				secretAccessKey: env.AWS.secretAccessKey,
				apiVersion: "2012-11-05",
			});
			var params = {
				MessageBody: JSON.stringify({
					action: action,
					method: method,
					data: data,
				}),
				QueueUrl: env.AWS.SQS.secondaryTasks,
			};

			let response = await sqs.sendMessage(params, function (err, data) {
				if (err) {
					console.log("Error SQS", err);
				} else {
					console.log("Success", data.MessageId);
				}
			});
			console.log("response", response); 
		} catch (ex) {
			console.log("Unable to push notification data to SQS", ex);
		}
	}
};
