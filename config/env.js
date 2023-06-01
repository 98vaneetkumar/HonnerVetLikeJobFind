const constants = require("../config/constants.js");
module.exports = () => {
	let environment = process.env;
	switch (environment.NODE_ENV) {
		case "dev":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.DEV,
				AWS: constants.AWS.DEV,
				DATABASE: constants.DATABASE.DEV,
				EMAIL: constants.EMAIL.DEV,
				FCM: constants.FCM.DEV,
				TWILIO: constants.TWILIO.DEV,
				PORT: constants.SERVER.DEV.PORT,
				STRIPE: constants.STRIPE.DEV,
				CHATTABLE: constants.CHATTABLE.DEV,
				PAGESURL: constants.PAGESURL.DEV
			};
		case "stage":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.STAGE,
				AWS: constants.AWS.STAGE,
				DATABASE: constants.DATABASE.STAGE,
				EMAIL: constants.EMAIL.STAGE,
				FCM: constants.FCM.STAGE,
				TWILIO: constants.TWILIO.STAGE,
				PORT: constants.SERVER.STAGE.PORT,
				STRIPE: constants.STRIPE.STAGE,
				CHATTABLE: constants.CHATTABLE.STAGE,
				PAGESURL: constants.PAGESURL.STAGE
			};
		case "production":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.PROD,
				AWS: constants.AWS.PROD,
				DATABASE: constants.DATABASE.PROD,
				EMAIL: constants.EMAIL.PROD,
				FCM: constants.FCM.PROD,
				TWILIO: constants.TWILIO.PROD,
				PORT: constants.SERVER.PROD.PORT,
				STRIPE: constants.STRIPE.PROD,
				CHATTABLE: constants.CHATTABLE.PROD,
				PAGESURL: constants.PAGESURL.PROD
			};
		case "local":
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.LOCAL,
				AWS: constants.AWS.LOCAL,
				DATABASE: constants.DATABASE.LOCAL,
				EMAIL: constants.EMAIL.LOCAL,
				FCM: constants.FCM.LOCAL,
				TWILIO: constants.TWILIO.LOCAL,
				PORT: constants.SERVER.LOCAL.PORT,
				STRIPE: constants.STRIPE.LOCAL,
				CHATTABLE: constants.CHATTABLE.LOCAL,
				PAGESURL: constants.PAGESURL.DEV
			};
		default:
			return {
				APP_NAME: constants.APP_NAME,
				DEFAULTS: constants.DEFAULTS,
				APP_URLS: constants.APP_URLS.LOCAL,
				AWS: constants.AWS.LOCAL,
				DATABASE: constants.DATABASE.LOCAL,
				EMAIL: constants.EMAIL.LOCAL,
				FCM: constants.FCM.LOCAL,
				TWILIO: constants.TWILIO.LOCAL,
				PORT: constants.SERVER.LOCAL.PORT,
				STRIPE: constants.STRIPE.LOCAL,
				CHATTABLE: constants.CHATTABLE.LOCAL,
				PAGESURL: constants.PAGESURL.DEV
			};
	}
};
