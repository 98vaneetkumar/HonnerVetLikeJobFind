const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const Services = require("../../services");

module.exports = {
	getStatslisting : async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
				recruiterId:Joi.string().optional()
			});
			// const TODAY_START = moment().add(1, "days").format("YYYY-MM-DD");
			// const fromDate =moment().subtract(7, "day").format("YYYY-MM-DD");
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {};

			if (_.has(payloadData, "startDate")) criteria.startDate = payloadData.startDate;
			if (_.has(payloadData, "endDate")) criteria.endDate = payloadData.endDate;

			let totalSearches = await Services.RecruiterDashboardService.countTotalSearch(payload);
			let emailsSent = await Services.RecruiterDashboardService.countEmail(payload,2);
			let emailsOpen = await Services.RecruiterDashboardService.countEmail(payload,5);
			let candidateClicks = await Services.RecruiterDashboardService.countEmail(payload,6);
			let inventoryUsedByMonth=await Services.RecruiterDashboardService.inventoryUsedByMonth(payload,1);
			let top10InventoryUsedByUser=await Services.RecruiterDashboardService.top10inventoryUsedByUser(payload);
			// let top10
			return {
				totalSearches: totalSearches,
				emailsSent: emailsSent,
				emailsOpen: emailsOpen,
				candidateClicks: candidateClicks,
				inventoryUsedByMonth:inventoryUsedByMonth,
				topTenInventoryUsedByUser:top10InventoryUsedByUser

			};
		}catch (err){
			console.log(err);
			throw err;
		}
	}
};