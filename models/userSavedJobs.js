// module.exports = function (Sequelize, sequelize, DataTypes) {
// 	return sequelize.define("user_saved_jobs", {
// 		...require("./core")(Sequelize, DataTypes),
// 		userId: {
// 			onDelete: "CASCADE",
// 			onUpdate: "CASCADE",
// 			references: {
// 				key: "id",
// 				model: "users"
// 			},
// 			type: Sequelize.UUID
// 		},
// 		jobId: {
// 			onDelete: "CASCADE",
// 			onUpdate: "CASCADE",
// 			references: {
// 				key: "id",
// 				model: "jobs"
// 			},
// 			type: Sequelize.UUID
// 		},
// 		isSaved: {
// 			type: DataTypes.TINYINT(1),
// 			defaultValue: 1
// 		}
// 	}, {
// 		tableName: "user_saved_jobs"
// 	});
// };
