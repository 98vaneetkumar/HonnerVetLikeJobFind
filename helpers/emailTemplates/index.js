module.exports = {
	forgotPassword: require("./forgotPassword").forgotPassword,
	registerUser: require("./registerUser").registerUser,
	registerAdmin: require("./registerAdmin").registerAdmin,
	registerRecruiter: require("./registerRecruiter").registerRecruiter,
	forgotPasswordAdmin: require("./forgotPasswordAdmin").forgotPasswordAdmin,
	forgotPasswordRecruiter: require("./forgotPasswordRecruiter").forgotPasswordRecruiter,
	adminRecruiterApproved: require("./adminRecruiterApproved").adminRecruiterApproved,
	emailNotification:require("./emailNotification").emailNotification
};