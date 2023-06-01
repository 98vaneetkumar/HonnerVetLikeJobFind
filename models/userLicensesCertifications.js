module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_license_and_certifications", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		attestedByAuthority: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		certificationNo: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},
		credentialUrl : {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		description : {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		issuesedOn: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		expirydate: {
			type: DataTypes.DATE,
			defaultValue: null, 
		}
	}, {
		tableName: "user_license_and_certifications"
	});
};
