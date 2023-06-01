
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("recruiter_view", {
		...require("./core")(Sequelize, DataTypes),
		recuiterId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "recruiter",
			},
			defaultValue: null,
			type: Sequelize.UUID,
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
		actionType:{
			type: DataTypes.TINYINT(1),
			defaultValue: 0   //0 view  1 is download 2 is mail sent 3 for favourite 4 for hide 
		},
		note:{
			type:DataTypes.STRING,
			defaultValue:null
		}
	}, {
		tableName: "recruiter_view"
	});
};

// 0 for view
// 1 for download
// 2 for mail send
// 3 for favourite
// 4 for hide
// 5 for email open
// 6 for candidate clicks
// 7 for total Searches 
// 8 for search conducted
// 9 for saved searches