// const { Sequelize } = require("sequelize");
let secondaryTasksController = require("./controllers/secondaryTasksController");
var https = require("https");
https.globalAgent.maxSockets = 2048;
let constants = require("./config/appConstants");

let sequelize = null;

let notificationTasks = async (method, payload) => {
	try {
		if (method) {
			await secondaryTasksController[method](payload);
		} else {
			console.log("Invalid method value");
		}
	} catch (ex) {
		console.log(method, ex);
	}
};

let openSearchTasks = async (method, payload) => {
	try {
		if (method) {
			await secondaryTasksController[method](payload);
		} else {
			console.log("Invalid method value");
		}
	} catch (ex) {
		console.log(method, ex);
	}
};

let emailTasks = async (method, payload) => {
	try {
		if (method) {
			await secondaryTasksController[method](payload);
		} else {
			console.log("Invalid method value");
		}
	} catch (ex) {
		console.log(method, ex);
	}
};

let testTasks = async (method, payload) => {
	try {
		if (method) {
			await secondaryTasksController[method](payload);
		} else {
			console.log("Invalid method value");
		}
	} catch (ex) {
		console.log(method, ex);
	}
};

let cronTasks = async (method, payload) => {
	try {
		if (method) {
			await secondaryTasksController[method](payload);
		} else {
			console.log("Invalid method value");
		}
	} catch (ex) {
		console.log(method, ex);
	}
};

exports.handler = async (event) => {
	if (!sequelize) {
		sequelize = await require("./dbConnection").connectDB();
	} else {
		console.log("Database already connected");
		// restart connection pool to ensure connections are not re-used across invocations
		sequelize.connectionManager.initPools();
		// restore `getConnection()` if it has been overwritten by `close()`
		if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
			delete sequelize.connectionManager.getConnection;
		}
	}
	try {
		try {
			if (event.Records && event.Records.length > 0) {
				for (var i = 0; i < event.Records.length; i++) {
					let sqsMessage = event.Records[i];
					console.log("sqsMessage", sqsMessage);
					var payload = JSON.parse(sqsMessage.body);
					if (payload && payload.action) {
						let data = payload.data;
						if (
							payload.action ==
              constants.APP_CONSTANTS.SECONDARY_ACTIONS.NOTIFICATIONS
						) {
							await notificationTasks(payload.method, data);
						} else if (
							payload.action ==
              constants.APP_CONSTANTS.SECONDARY_ACTIONS.OPEN_SEARCH
						) {
							await openSearchTasks(payload.method, data);
						} else if (
							payload.action == constants.APP_CONSTANTS.SECONDARY_ACTIONS.EMAIL
						) {
							await emailTasks(payload.method, data);
						} else if (
							payload.action == constants.APP_CONSTANTS.SECONDARY_ACTIONS.TEST
						) {
							await testTasks(payload.method, data);
						}
					}
				}
			} else if (event.key && event.key === "CRON") {
				console.log("in cronTasks function---------------");
				await cronTasks(event.method, "");
			}
		} catch (ex) {
			console.log(ex);
		}
	} catch (ex) {
		console.log(ex);
	}
	const response = {
		statusCode: 200,
		body: JSON.stringify("Success!"),
	};
	return response;
};
