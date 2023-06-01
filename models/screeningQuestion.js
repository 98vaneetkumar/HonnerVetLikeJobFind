module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("screening_question", {
		...require("./core")(Sequelize, DataTypes),
		title: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		question: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		responseType: {
			type: DataTypes.TINYINT(1), // 0 for radio button and 1 for text
			defaultValue: 0,
		},
		answer : {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
	}, {
		tableName: "screening_question"
	});
};
