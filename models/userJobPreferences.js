let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_job_preferences", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},  
		desiredSalary: {
			type: DataTypes.FLOAT,
			defaultValue: null,
		},   
		desiredSalaryCurrency: {
			type: DataTypes.TEXT,
			defaultValue: "USD",
		},    
		travelRequirement: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		dateOfAvailability: {
			type: DataTypes.DATE,
			defaultValue: null,
		},    
		workPlace: {
			type: DataTypes.TEXT,
			defaultValue: null,
		}, 
		securityClearance: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},        
		desiredSalaryType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.DESIRED_SALARY_TYPES
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
		employementTypeId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "employement_types"
			},
			type: Sequelize.UUID
		},
		otherServiceTitle: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		willingToRelocate: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
		},
		covidVaccinated: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
		},
	}, {
		tableName: "user_job_preferences"
	});
};
