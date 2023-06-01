module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"job_post_address",
		{
			...require("./core")(Sequelize, DataTypes),
			jobPostId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "job_posts",
				},
				type: Sequelize.UUID,
			},
			location: {
				type: DataTypes.TEXT,
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
		},
		{
			tableName: "job_post_address",
		}
	);
};
