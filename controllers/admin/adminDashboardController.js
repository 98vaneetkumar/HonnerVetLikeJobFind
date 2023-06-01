const _ = require("underscore");
const Joi = require("joi");
let commonHelper = require("../../helpers/common");
let Services = require("../../services");
const moment = require("moment");

module.exports = {
	getStatslisting : async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				startDate: Joi.date().optional(),
				endDate: Joi.date().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {};

			// if (_.has(payloadData, "startDate")) criteria.startDate = payloadData.startDate;
			// if (_.has(payloadData, "endDate")) criteria.endDate = payloadData.endDate;

			if (payload.startDate && payload.startDate != "") {
				payload.startDate = moment(payload.startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.endDate && payload.endDate != "") {
				payload.endDate = moment(payload.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			console.log(criteria, "criteria")
			let totalUser = await Services.AdminUserService.countData(payload);
			let totalDeativeUser = await Services.AdminUserService.countDataBlocked(payload);
			let totalActiveUser = await Services.AdminUserService.countDataUnblocked(payload);
			let totalRecruiters = await Services.AdminRecruiterService.countData(payload);
			let totalRecruitersActive = await Services.AdminRecruiterService.countDataActive(payload);
			let totalRecruitersDeactive = await Services.AdminRecruiterService.countDataBlocked(payload);
			let totalSubscriptions=await Services.PaymentPlanService.subscriptionCount(payload);
			let totalInventory=await Services.PaymentPlanService.inventoryCount(payload);
			return {
				totalUser: totalUser,
				totalDeativeUser: totalDeativeUser,
				totalActiveUser:totalActiveUser,
				totalRecruiters: totalRecruiters,
				totalRecruitersActive: totalRecruitersActive,
				totalRecruitersDeactive:totalRecruitersDeactive,
				totalSubscriptions: totalSubscriptions,
				totalInventoryPlans: totalInventory,
			};
		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getUserGraph : async(payloadData) => {
		try {
			const schema = Joi.object().keys({
				startDate: Joi.date().iso("YYYY-MM-DD HH:mm:ss").optional(),
				endDate: Joi.date().iso("YYYY-MM-DD HH:mm:ss").optional(),
				dateRange: Joi.string().optional().valid("TODAY", "WEEK", "MONTH", "YEAR")
			});

			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			if (payload.startDate && payload.startDate != "") {
				payload.startDate = moment(payload.startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.endDate && payload.endDate != "") {
				payload.endDate = moment(payload.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}

			const payload1 = { ...payload };
			delete payload["dateRange"];

			var list = [];
			var list1 = [];
			let countActiveUsers, countRecruiter;
			if (payload1.dateRange == "TODAY") {
				countActiveUsers = await Services.AdminUserService.get_today_user(payload1);
				list = [0];
            
				if (countActiveUsers != undefined) {
					for (let i = 0; i < countActiveUsers.length; i++) {
						var index = 0;
						list[index] = (parseInt(countActiveUsers[i].count));
                       

					}
				}

			} else if (payload1.dateRange == "WEEK") {
				list = [0, 0, 0, 0, 0, 0, 0];
              
				countActiveUsers = await Services.AdminUserService.get_weekly_user(payload1);

				if (countActiveUsers != undefined) {
					for (let i = 0; i < countActiveUsers.length; i++) {
						let index = countActiveUsers[i].day - 1;
						list[index] = (parseInt(countActiveUsers[i].count));
                        
					}
				}
			} else if (payload1.dateRange == "MONTH") {
				countActiveUsers = await Services.AdminUserService.get_monthly_user(payload1);
				list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
				if (countActiveUsers != undefined) {
					for (let i = 0; i < countActiveUsers.length; i++) {
						let index = countActiveUsers[i].day - 1;
						list[index] = (parseInt(countActiveUsers[i].count));
                      
					}
				}
			} else if (payload1.dateRange == "YEAR") {
				countActiveUsers = await Services.AdminUserService.get_yearly_user(payload1);
				console.log(countActiveUsers);
				list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              
				if (countActiveUsers != undefined) {
					for (let i = 0; i < countActiveUsers.length; i++) {
						let index = parseInt(countActiveUsers[i].month) - 1;
						list[index] = (parseInt(countActiveUsers[i].count));
                       
					}
				}

			}
			// -----------------------------Recruiter----------------------------------
			if (payload1.dateRange == "TODAY") {
				countRecruiter = await Services.AdminRecruiterService.get_today_user(payload1);
				list1 = [0];
            
				if (countRecruiter != undefined) {
					for (let i = 0; i < countRecruiter.length; i++) {
						let index = 0;
						list1[index] = (parseInt(countRecruiter[i].count));
                       

					}
				}

			} else if (payload1.dateRange == "WEEK") {
				list1 = [0, 0, 0, 0, 0, 0, 0];
              
				countRecruiter = await Services.AdminRecruiterService.get_weekly_user(payload1);

				if (countRecruiter != undefined) {
					for (let i = 0; i < countRecruiter.length; i++) {
						let index = countRecruiter[i].day - 1;
						list1[index] = (parseInt(countRecruiter[i].count));
                        
					}
				}
			} else if (payload1.dateRange == "MONTH") {
				countRecruiter = await Services.AdminRecruiterService.get_monthly_user(payload1);
				list1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
				if (countRecruiter != undefined) {
					for (let i = 0; i < countRecruiter.length; i++) {
						let index = countRecruiter[i].day - 1;
						list1[index] = (parseInt(countRecruiter[i].count));
                      
					}
				}
			} else if (payload1.dateRange == "YEAR") {
				countRecruiter = await Services.AdminRecruiterService.get_yearly_user(payload1);
				console.log(countRecruiter);
				list1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              
				if (countRecruiter != undefined) {
					for (let i = 0; i < countRecruiter.length; i++) {
						let index = parseInt(countRecruiter[i].month) - 1;
						list1[index] = (parseInt(countRecruiter[i].count));
                       
					}
				}

			}
			return {
				user :list,
				recruiter :list1
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	},
	getGraphList : async(payloadData) => {
		try{
			const schema = Joi.object().keys({
				startDate: Joi.date().iso("YYYY-MM-DD HH:mm:ss").optional(),
				endDate: Joi.date().iso("YYYY-MM-DD HH:mm:ss").optional(),
				dateRange: Joi.string().optional().valid("TODAY", "WEEK", "MONTH", "YEAR"),
				yearByData: Joi.string().optional()
			});

			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

			if (payload.startDate && payload.startDate != "") {
				payload.startDate = moment(payload.startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
			}
			if (payload.endDate && payload.endDate != "") {
				payload.endDate = moment(payload.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
			}

			const payload1 = { ...payload };
			payload1.planType= 0;
			const payload2 = { ...payload };
			payload2.planType= 1;
			delete payload["dateRange"];

			var list = [];
			var list1 = [];
			let countSubcription, countInventroy;
			if (payload1.dateRange == "TODAY") {
				countSubcription = await Services.PaymentPlanService.get_today_user(payload1);
				list = [0];
            
				if (countSubcription != undefined) {
					for (let i = 0; i < countSubcription.length; i++) {
						var index = 0;
						list[index] = (parseInt(countSubcription[i].count));
                       

					}
				}

			} else if (payload1.dateRange == "WEEK") {
				list = [0, 0, 0, 0, 0, 0, 0];
              
				countSubcription = await Services.PaymentPlanService.get_weekly_user(payload1);

				if (countSubcription != undefined) {
					for (let i = 0; i < countSubcription.length; i++) {
						let index = countSubcription[i].day - 1;
						list[index] = (parseInt(countSubcription[i].count));
                        
					}
				}
			} else if (payload1.dateRange == "MONTH") {
				countSubcription = await Services.PaymentPlanService.get_monthly_user(payload1);
				list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
				if (countSubcription != undefined) {
					for (let i = 0; i < countSubcription.length; i++) {
						let index = countSubcription[i].day - 1;
						list[index] = (parseInt(countSubcription[i].count));
                      
					}
				}
			} else if (payload1.dateRange == "YEAR") {
				countSubcription = await Services.PaymentPlanService.get_yearly_user(payload1);
				list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              
				if (countSubcription != undefined) {
					for (let i = 0; i < countSubcription.length; i++) {
						let index = parseInt(countSubcription[i].month) - 1;
						list[index] = (parseInt(countSubcription[i].count));
                       
					}
				}

			}
			// -------------------------------Inventory---------------------------------
			if (payload1.dateRange == "TODAY") {
				countInventroy = await Services.PaymentPlanService.get_today_user(payload2);
				list1 = [0];
            
				if (countInventroy != undefined) {
					for (let i = 0; i < countInventroy.length; i++) {
						let index = 0;
						list1[index] = (parseInt(countInventroy[i].count));
                       

					}
				}

			} else if (payload1.dateRange == "WEEK") {
				list1 = [0, 0, 0, 0, 0, 0, 0];
              
				countInventroy = await Services.PaymentPlanService.get_weekly_user(payload2);

				if (countInventroy != undefined) {
					for (let i = 0; i < countInventroy.length; i++) {
						let index = countInventroy[i].day - 1;
						list1[index] = (parseInt(countInventroy[i].count));
                        
					}
				}
			} else if (payload1.dateRange == "MONTH") {
				countInventroy = await Services.PaymentPlanService.get_monthly_user(payload2);
				list1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
				if (countInventroy != undefined) {
					for (let i = 0; i < countInventroy.length; i++) {
						let index = countInventroy[i].day - 1;
						list1[index] = (parseInt(countInventroy[i].count));
                      
					}
				}
			} else if (payload1.dateRange == "YEAR") {
				countInventroy = await Services.PaymentPlanService.get_yearly_user(payload2);
				list1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              
				if (countInventroy != undefined) {
					for (let i = 0; i < countInventroy.length; i++) {
						let index = parseInt(countInventroy[i].month) - 1;
						list1[index] = (parseInt(countInventroy[i].count));
                       
					}
				}

			}
			return {
				subscription : list,
				inventory : list1
			};

		}catch (err){
			console.log(err);
			throw err;
		}
	}
};