const _ = require("underscore");
const Joi = require("joi");
const commonHelper = require("../../helpers/common");
const Services = require("../../services");

module.exports = {
	getuserActivityReport : async(payloadData) => {
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

			let totalInvetoryUsed = await Services.RecruiterReportService.countTotalInvetoryUsed(payload,1);
			let totalInvetoryPlan = await Services.RecruiterReportService.countTotalInvetoryPlan(payload,1);
			let emailsSent = await Services.RecruiterReportService.countEmail(payload,2);
			let candidateClicks = await Services.RecruiterReportService.countEmail(payload,6);
			let totalSearch = await Services.RecruiterReportService.countEmail(payload,7);
			return {
				totalInvetoryUsed: totalInvetoryUsed,
				totalInvetoryPlan:totalInvetoryPlan,
				emailsSent: emailsSent,
				totalSearch:totalSearch,
				candidateClicks: candidateClicks,
			};
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getsearchDetailReport : async(payloadData) => {
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

			let searchConducted = await Services.RecruiterReportService.countEmail(payload,8);
			let savedSearch = await Services.RecruiterReportService.countEmail(payload,9);
			let searchConductByMonth=await Services.RecruiterReportService.searchConductByMonth(payload);
			let searchByKeywords= await Services.RecruiterReportService.searchByKeywords(payload);
			return {
				searchConducted: searchConducted,
				savedSearch:savedSearch,
				searchConductByMonth:searchConductByMonth,
				searchByKeywords:searchByKeywords
			};
		}catch (err){
			console.log(err);
			throw err;
		}
	}
};