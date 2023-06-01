var nodeMailer = require("nodemailer");

const env = require("../config/env")();
var emailTemplates = require("./emailTemplates");

let renderMessageFromTemplateAndVariables = async (templateData, variablesData) => {
	var Handlebars = require("handlebars");
	console.log("inside render template...");
	return await Handlebars.compile(templateData)(variablesData);
};
module.exports = {
	sendMail: async (emailType, emailId, emailVariables) => {
		emailVariables.baseUrl = env.APP_URLS.API_URL;
		var transport = await nodeMailer.createTransport(
			{
				service: env.EMAIL.MAIL_SERVICE,
				host: env.EMAIL.HOST,
				auth: {
					user: env.EMAIL.SMTP_CREDENTIALS.email,
					pass: env.EMAIL.SMTP_CREDENTIALS.password
				}
			});
		var message = {
			from: `${env.APP_NAME} <${env.EMAIL.SMTP_CREDENTIALS.email}>`,
			to: emailId
		};
		console.log("inside sendEmail");
		switch (emailType) {
			case "REGISTER_USER":
				message.subject = "Verify OTP for HonorVet";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.registerUser, emailVariables);
				break;
			case "FORGOT_PASSWORD":
				message.subject = "Reset Password for HonorVet";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.forgotPassword, emailVariables);
				break;
			case "FORGOT_PASSWORD_ADMIN":
				message.subject = "Forgot Password";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.forgotPasswordAdmin, emailVariables);
				break;
			case "ADD_ADMIN":
				message.subject = `Registered with ${env.APP_NAME}`;
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.registerAdmin, emailVariables);
				break;
			case "REGISTER_RECRUITER":
				message.subject = "Verify OTP for Recruiter HonorVet";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.registerRecruiter, emailVariables);
				break;
			case "RECRUITER_STATUS":
				message.subject = "Admin Recruiter Status";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.adminRecruiterApproved, emailVariables);
				break;	
			case "FORGOT_PASSWORD_RECRUITER":
				message.subject = "Reset Password for HonorVet";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.forgotPasswordRecruiter, emailVariables);
				break;
			case "EMAIL_NOTIFICATION":
				message.subject = "Email notification for credentials are using on another device";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.emailNotification, emailVariables);
				break;	
		}
		return new Promise((resolve) => {
			transport.sendMail(message, (error) => {
				console.log("sending email...");
				if (error) {
					console.log("send mail error--", error);
					resolve(false);
				} else {
					console.log("Success...");
					resolve(true);
				}
			});
		});
	},
};