module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_educations", {
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
		specializationId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "specializations"
			},
			type: Sequelize.UUID
		},
		universityId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "universities"
			},
			type: Sequelize.UUID
		},
		fromDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		toDate: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		gpa: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		isPursuing: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		otherTitleUniveristy: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		otherTitleSpecialization: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		}
	}, {
		tableName: "user_educations"
	});
};
