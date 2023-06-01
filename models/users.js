let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("users", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		email: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		password: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		bio: {
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
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		registrationStep: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		serviceDisabled: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		emailVerificationToken: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		facebookId: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		googleId: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		appleId: {
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
		otpGeneratedAt: {
			type: DataTypes.DATE(),
			defaultValue: null,
		},
		forgotPasswordToken: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		personalityTest: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		militaryJobTitle: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		location: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		linkedInLink: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		scoreLink: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		pronounsType: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		customPronouns: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		profileImage: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		veteranRelationName: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		veteranRelationType: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0, // 0 => veteran, 1 => Spouse, 2 => Child 3 =>Parents
		},
		authenticityDocumentLink: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		veteranRelationDocumentLink: {
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
		lastVisit :{
			type: DataTypes.DATE,
			defaultValue: null,
		},
		serviceId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "services"
			},
			defaultValue: null,
			type: Sequelize.UUID
		},
		otherServiceTitle: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		downloadUrl: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		platformType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.SUPPORTED_PLATFORMS
		},
		loginType: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0, // 0 => default, 1 => email, 2=> fb, 3= gmail, 4 => Apple
		},
		userType: {
			type: DataTypes.TINYINT(1), // 0 is I am Veteran 1 is I am Veteran Family member 
			defaultValue: 0,
		},
		notificationStatus: {
			type: DataTypes.TINYINT(1), // 0 on 1 is off 
			defaultValue: 0,
		},
		isTermsAndConditionsAccepted: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	}, { tableName: "users" }
	);
};
