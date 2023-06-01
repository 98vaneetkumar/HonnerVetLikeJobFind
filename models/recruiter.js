// let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		email: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		companyEmail: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		password: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		companyName: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		countryCode: {
			type: DataTypes.STRING(5),
			defaultValue: null,
		},
		phoneNumber: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		companySize: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		isPhoneVerified: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		otp: {
			type: DataTypes.STRING(6),
			defaultValue: null,
		},
		isEmailVerified: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		gender: {
			type: DataTypes.TINYINT(1),  //0 for male 1 form female and 2 for others
			defaultValue: 0
		},
		emailVerificationToken: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		forgotPasswordOtp: {
			type: DataTypes.STRING(),
			defaultValue: null,
		},
		forgotPasswordGeneratedAt: {
			type: DataTypes.DATE(),
			defaultValue: null,
		},
		forgotPasswordToken: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		customerId: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		userType: {
			type: DataTypes.STRING(200),
			defaultValue: null
		},
		recruiterId: {
			type: Sequelize.UUID,
			defaultValue: null,
			references: {     // company id 
				model: "recruiter", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		location: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		linkedInLink: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		websiteLink: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		industry: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		profileImage: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		zipCode: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		},
		latitude: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		longitude: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		dateOfBirth :{
			type: DataTypes.DATE,
			defaultValue: null,
		},
		isTermsAndConditionsAccepted: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		reason: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		isArchive: {
			type: DataTypes.TINYINT(1),  // 0 for  Users and 1 for Archive Users
			defaultValue: 0
		},
		isAdminApproved: {
			type: DataTypes.ENUM,
			values: ["-1", "0", "1"],
			defaultValue: "0",
		},
		address: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		state: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		city: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		isNotificationSMSSetting: {
			type: DataTypes.TINYINT(1), // 0 is on 1 is off 
			defaultValue: 0
		},
		isNotificationSetting: {
			type: DataTypes.TINYINT(1), // 0 is on 1 is off 
			defaultValue: 0
		},
		subscribePayment: {
			type: DataTypes.TINYINT(1), // 0 is off 1 is on auto payment
			defaultValue: 0
		},
		inventoryPayment: {
			type: DataTypes.TINYINT(1), // 0 is off 1 is on auto payment
			defaultValue: 0
		},
		subscribeHonorvet: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		stripeBody: {
			type: DataTypes.TEXT,
			defaultValue: null,
			field: "stripeBody"
		}

	}, { tableName: "recruiter" }
	);
};
