const SERVER_CONST = {
	MOBILE_REGEX_NEW_SPACE: "^[0-9]*$",
	FIRST_NAME_REGEX: /^([a-zA-Z0-9 _@$%./#&''"+-,]+)$/,
	EMAIL_REGEX: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/,
};
const APP_CONSTANTS = {
	ACHIEVEMENT_EVENT_TYPES: ["COUNT", "SUM", "AVERAGE"],
	DESIRED_SALARY_TYPES: ["Per Hour","Per Day","Per Week","Per Month","Per Annum"],
	ACHIEVEMENT_EVENTS: ["Referral", "Like", "Comment", "Report"],
	ACHIEVEMENT_TYPES: ["Parallel", "Sequential"],
	ADMIN_MODULES: [
		"userManagement",
		"adminManagement",
		"employerManagement",
		"rewardManagement",
		"userManagement",
		"dashboard",
		"transactionManagement",
		"reportManagement",
		"profileManagement",
		"notificationManagement",
		"paymentManagement",
		"categoryManagement",
		"recruiterManagement",
		"storiesManagement",
		"promoCodes"

	],
	PERMISSION_MODULES: [
		"createJob",
		"viewTeamMemberJob",
		"editTeamMemberJob",
		"addTeamMember",
		"editTeamMember",
		"deleteTeamMember",
		"viewActivePlans",
		"buyInventory",
		"viewInvoice",
		"cancelSubscription",
		"dashboard",
		"jobPost",
		"search",
		"user",
		"groupAndPermission",
		"messages",
		"reports",
		"myCandidate"

	],
	ADMIN_TYPES: ["SUPER_ADMIN", "SUB_ADMIN"],
	adminTypes: {
		SUB_ADMIN: "SUB_ADMIN",
		SUPER_ADMIN: "SUPER_ADMIN",
	},
	PLATFORM_TYPE: {
		android: "ANDROID",
		ios: "IOS",
		web: "WEB",
		all:"ALL"
	},
	SUPPORTED_PLATFORMS: ["ANDROID", "IOS", "WEB", "ALL"],
	USER_TYPES: {
		CUSTOMER: 1,
		MERCHANT: 2
	},
	SECONDARY_ACTIONS: {
		NOTIFICATIONS: "Notifications",
		OPEN_SEARCH: "OpenSearch",
		EMAIL: "Email",
		TEST: "Test"
	}
};
module.exports = {
	APP_CONSTANTS: APP_CONSTANTS,
	SERVER_CONST: SERVER_CONST,
};