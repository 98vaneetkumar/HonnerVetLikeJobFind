const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const env = require("./config/env")();
const serverless = require("serverless-http");
require("./firebase");

var indexRouter = require("./routes/index");
var appCommon = require("./routes/appCommon");
var userRouter = require("./routes/user");
var userBuildResumeRouter = require("./routes/userBuildResume");
// Admin API Route File
var adminCommonRouter = require("./routes/adminCommon");
var adminServicesRouter = require("./routes/adminServices");
var adminUniversitiesRouter = require("./routes/adminUniversities");
var adminEmploymentTypesRouter = require("./routes/adminEmploymentTypes");
var adminSpecializationRouter = require("./routes/adminSpecializations");
var adminSkillsRouter = require("./routes/adminSkills");
var adminJobTitleRouter = require("./routes/adminJobTitles");
var adminIndustryRouter = require("./routes/adminIndustries");
var adminCategoryRouter = require("./routes/adminCategories");
var adminRouter = require("./routes/admin");
var adminUsersRouter = require("./routes/adminUsers");
var adminDashboardRouter = require("./routes/adminDashboard");
var adminRecruiterRouter = require("./routes/adminRecruiter");
var adminSuggestSkillsRouter = require("./routes/adminSuggestSkills");
var recruiterRouter = require("./routes/recruiter");
var paymentPlan = require("./routes/paymentPlan");
var adminBenefitsRouter = require("./routes/adminBenefits");
var recruiterCommonRouter = require("./routes/recruiterCommon");
var adminScheduleRouter = require("./routes/adminSchedule");
var adminSupplementRouter = require("./routes/adminSupplement");
var adminEligibleRouter = require("./routes/adminEligible");
var adminPersonalitiesRouter = require("./routes/adminPersonalities");
var adminHireRouter = require("./routes/adminHire");
var adminScreeningQuestionRouter = require("./routes/adminScreeningQuestion");
var jobPost = require("./routes/jobPostRouter");
var adminNotificationMessageRouter = require("./routes/adminNotificationMessage");
var adminNotificationRouter = require("./routes/adminNotification");
var adminTravelRequirementRouter = require("./routes/adminTravelRequirement");
var userJobApplyRouter = require("./routes/userJob");
var adminSecurityClearenceRouter = require("./routes/adminSecurityClearenceRoutes");
var GroupPermissionRouter = require("./routes/GroupPermissionRoutes");
var recruiterUsersRouter = require("./routes/recruiterUsersRouter");
var FovouriteAndSkippedCandidate = require("./routes/recruiterFavouriteAndSkipped");
var HomeScreenUser = require("./routes/homeScreenRouter");
var RecuiterSearch = require("./routes/recruiterSearch");
var adminJobsPostedRouter = require("./routes/adminJobsPostedRouter");
var paymentPlanRecruiter = require("./routes/recruiterPaymentPlanRouter");
var recruiterDashboardRouter = require("./routes/recruiterDashboardRoutes");
var successStoriesRouter = require("./routes/successStoriesRoutes");
var adminPromoCode = require("./routes/adminPromoCodeRoutes");
var chats = require("./routes/chats");
var userNotificationRouter=require("./routes/userNotification");
var CronSchedule=require("./routes/cronSchedule");
var userTurnOffNotificationRouter=require("./routes/userTurnOffNotification");
var RecruiterReportRecruiter=require("./routes/recruiterReport");
var templateRoutes = require("./routes/templatesRoutes");
// var userNotificationRouter=require("./routes/userNotification");

var __dirname = path.resolve();
var app = express();

// ROUTES Path
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
	//Enabling CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
	);
	next();
});
var urlEnv = process.env.NODE_ENV === "dev" ? "dev" : "stage";
console.log("urlEnv::::",urlEnv);
var swaggerOptions = {
	explorer: true,
	swaggerOptions: {
		urls: [
			{
				url: "/"+urlEnv+"/documentation",
				name: "API",
			},
			{
				url: "/"+urlEnv+"/documentation-admin",
				name: "API - Admin",
			},
			{
				url: "/"+urlEnv+"/documentation-recruiter",
				name: "API - Recruiter",
			},
		],
	},
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));
app.use("/", indexRouter);
app.use("/api/v1/common", appCommon);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/buildResume", userBuildResumeRouter);
// Admin API Route
app.use("/admin/v1/common", adminCommonRouter);
app.use("/admin/v1/services", adminServicesRouter);
app.use("/admin/v1/universities", adminUniversitiesRouter);
app.use("/admin/v1/specializations", adminSpecializationRouter);
app.use("/admin/v1/employmentTypes", adminEmploymentTypesRouter);
app.use("/admin/v1/skills", adminSkillsRouter);
app.use("/admin/v1/industry", adminIndustryRouter);
app.use("/admin/v1/jobTitle", adminJobTitleRouter);
app.use("/admin/v1/admin", adminRouter);
app.use("/admin/v1/category", adminCategoryRouter);
app.use("/admin/v1/users", adminUsersRouter);
app.use("/admin/v1/dashboard", adminDashboardRouter);
app.use("/recruiter/v1/dashboard", recruiterDashboardRouter);
app.use("/admin/v1/recruiter", adminRecruiterRouter);
app.use("/admin/v1/suggestSkills", adminSuggestSkillsRouter);
app.use("/admin/v1/benefits", adminBenefitsRouter);
app.use("/admin/v1/supplements", adminSupplementRouter);
app.use("/admin/v1/eligible", adminEligibleRouter);
app.use("/admin/v1/personalities", adminPersonalitiesRouter);
app.use("/admin/v1/hire", adminHireRouter);
app.use("/admin/v1/schedules", adminScheduleRouter);
app.use("/recruiter/v1/recruiter", recruiterRouter);
app.use("/recruiter/v1/common", recruiterCommonRouter);
app.use("/admin/v1/paymentPlan", paymentPlan);
app.use("/recruiter/v1/recruiter/paymentPlan", paymentPlanRecruiter);
app.use("/admin/v1/screening-question", adminScreeningQuestionRouter);
app.use("/recruiter/v1/recruiter/jobpost", jobPost);
app.use("/admin/v1/notification-message", adminNotificationMessageRouter);
app.use("/admin/v1/notification", adminNotificationRouter);
app.use("/admin/v1/travelRequirement", adminTravelRequirementRouter);
app.use("/api/v1/jobs", userJobApplyRouter);
app.use("/admin/v1/securityClearence", adminSecurityClearenceRouter);
app.use("/recruiter/v1/group-permission", GroupPermissionRouter);
app.use("/recruiter/v1/users", recruiterUsersRouter);
app.use("/recruiter/v1/candidate", FovouriteAndSkippedCandidate);
app.use("/user/v1/home", HomeScreenUser);
app.use("/admin/v1/jobs", adminJobsPostedRouter);
app.use("/api/v1/home", HomeScreenUser);
app.use("/recruiter/v1/recruiterSearch", RecuiterSearch);
app.use("/admin/v1/successStories", successStoriesRouter);
app.use("/admin/v1/promoCode", adminPromoCode);
app.use("/api/v1/chat", chats);
app.use("/api/v1/notification", userNotificationRouter);
app.use("/api/v1/cron", CronSchedule);
app.use("/api/v1/notificationTurnOff", userTurnOffNotificationRouter);
app.use("/recruiter/v1/report", RecruiterReportRecruiter);
app.use("/api/v1/notification", userNotificationRouter);
app.use("/recruiter/v1/template", templateRoutes);
require("./dbConnection").connectDB();
app.use((req, res, next) => {
	if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
		return res.sendStatus(204);
	}
	return next();
});
app.use((req, res, next) => {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});
app.options("/*", cors()); // enable pre-flight request for DELETE request
// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	console.log(err);
	// render the error page
	res.status(err.status || 500);
	res.render("404", { baseUrl: env.APP_URLS.API_URL });
});

module.exports.handler = serverless(app);
