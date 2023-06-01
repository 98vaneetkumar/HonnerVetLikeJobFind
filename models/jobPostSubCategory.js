module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("job_post_sub_category", {
		...require("./core")(Sequelize, DataTypes),
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
		subCategoryId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "sub_categories",
			},
			defaultValue: null,
			type: Sequelize.UUID,
		},
		jobPostId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "job_posts"
			},
			type: Sequelize.UUID
		},
		others:{
			type:DataTypes.STRING,
			defaultValue:null
		},
	}, {
		tableName: "job_post_sub_category"
	});
};
