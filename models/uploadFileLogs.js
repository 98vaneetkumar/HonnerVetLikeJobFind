
// let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("upload_file_log", {
		...require("./core")(Sequelize, DataTypes), 
		floderName: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		},    
		fileName: {
			type: DataTypes.STRING(155),
			defaultValue: null,
		}        
	}, {
		tableName: "upload_file_log"
	});
};
