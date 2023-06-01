module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"job_posts",
		{
			...require("./core")(Sequelize, DataTypes),
			jobTitle: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			recuiterId: {
				onDelete: "CASCADE", //company id 
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "recruiter",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			categoryId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "categories",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			industryId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "industries",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			planId:{
				type:DataTypes.STRING,
				defaultValue:null
			},
			subRecuiterId:{
				type:DataTypes.STRING,    // sub recruiter id 
				defaultValue:null
			},
			userType:{
				type:DataTypes.STRING,  // sub-Recruiter and super is company
				defaultValue:null
			},
			description: {
				type: DataTypes.TEXT,
				defaultValue: null,
			},
			workPlaceLocation: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			location: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			state: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			city: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			zipCode: {
				type: DataTypes.STRING(15),
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
			steps:{
				type:DataTypes.INTEGER,
				defaultValue:0
			},
			employementTypeId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "employement_types",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			scheduleId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "schedules",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			payOption: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			price:{
				type: DataTypes.FLOAT(20),
				defaultValue: null,
			},
			minimum: {
				type: DataTypes.FLOAT(20),
				defaultValue: null,
			},
			maximum: {
				type: DataTypes.FLOAT(20),
				defaultValue: null,
			},
			rate: {
				type: DataTypes.STRING,
				defaultValue: null,
			},

			supplementalPayId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "supplements",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			jobEligibleForId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "eligibles",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			vaccinationCerificate: {
				type: DataTypes.TINYINT(1),
				defaultValue: 0, //0 for no and 1 for yes
			},
			travelRequirementId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "travel_requirements",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			noOfPeopleRequired: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			quicklyNeedForHireId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "hires",
				},
				defaultValue: null,
				type: Sequelize.UUID,
			},
			countryCode: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			phoneNumber: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			isConfirm: {
				type: DataTypes.TINYINT(1),
				allowNull: false,
				defaultValue: 0,
			},
			reason:{
				type: DataTypes.STRING,
				defaultValue: null,
			},
			jobClosingTime:{
				type: DataTypes.DATE,
				defaultValue:null
			}
		},
		{
			tableName: "job_posts",
		}
	);
};
