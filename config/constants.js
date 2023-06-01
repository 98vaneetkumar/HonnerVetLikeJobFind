const globalConstants = {
	DEFAULTS: {
		PAGE_LIMIT: 10,
	},
	APP_NAME: "HonorVet",
	APP_URLS: {
		LOCAL: {
			API_URL: "http://localhost:3000",
			API_ASSERT_URL: "http://localhost:3000/public/",
			ADMIN_URL: "http://localhost:4200",
			DOMAIN: "localhost:3000",
			WEB_URL: "",
			PRIVATE_KEY: "%#AvtK%$KA1&$$@PLP1c@t13V",
			PRIVATE_KEY_ADMIN: "%#ChyU%$KA1&$$@PBA1c@t7HB",
			PRIVATE_KEY_COACH: "%#LDDL%$KA1&$$@PLP2c@t4Th",
			TOKEN_EXPIRY: "1 * 30 * 1000 * 60 * 24",
			SETTING_URL: {
				privacy: "",
				terms: "",
			},
		},
		DEV: {
			API_URL: "https://lc0ekgayo5.execute-api.us-east-1.amazonaws.com/dev",
			API_ASSERT_URL:
				"https://lc0ekgayo5.execute-api.us-east-1.amazonaws.com/dev/public/",
			ADMIN_URL: "http://localhost:4200",
			DOMAIN: "lc0ekgayo5.execute-api.us-east-1.amazonaws.com/dev",
			WEB_URL: "",
			PRIVATE_KEY: "%#AvtK%$KA1&$$@PLP1c@t13V",
			PRIVATE_KEY_ADMIN: "%#ChyU%$KA1&$$@PBA1c@t7HB",
			PRIVATE_KEY_COACH: "%#CPPL%$KA1&$$@PLP2c@t4Th",
			TOKEN_EXPIRY: "1 * 30 * 1000 * 60 * 24",
			SETTING_URL: {
				privacy: "",
				terms: "",
			},
		},
		PROD: {
			API_URL: "http://localhost:3000",
			API_ASSERT_URL: "http://localhost:3000/public/",
			ADMIN_URL: "http://localhost:4200",
			DOMAIN: "localhost:3000",
			WEB_URL: "",
			PRIVATE_KEY: "%#MVtK%$KA1&$$@PLP1c@t13V",
			PRIVATE_KEY_ADMIN: "%#HbyU%$KA1&$$@PBA1c@t7HB",
			PRIVATE_KEY_COACH: "%#DCCL%$KA1&$$@PLP2c@t4Th",
			TOKEN_EXPIRY: "1 * 30 * 1000 * 60 * 24",
			SETTING_URL: {
				privacy: "",
				terms: "",
			},
		},
		STAGE: {
			API_URL: "https://w3jke9psob.execute-api.us-east-1.amazonaws.com/stage",
			API_ASSERT_URL: "http://localhost:3000/public/",
			ADMIN_URL: "http://localhost:4200",
			DOMAIN: "w3jke9psob.execute-api.us-east-1.amazonaws.com/stage",
			WEB_URL: "",
			PRIVATE_KEY: "%#XvCK%$KA1&$$@PLP1c@t13V",
			PRIVATE_KEY_ADMIN: "%#MCAU%$KA1&$$@PBA1c@t7HB",
			PRIVATE_KEY_COACH: "%#EEEL%$KA1&$$@PLP2c@t4Th",
			TOKEN_EXPIRY: "1 * 30 * 1000 * 60 * 24",
			SETTING_URL: {
				privacy: "",
				terms: "",
			},
		},
	},
	AWS: {
		LOCAL: {
			accessKeyId: "AKIAZP4PCVCSPXFICMZH",
			secretAccessKey: "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",
			awsRegion: "us-east-1",
			S3: {
				bucket: "honorvet-dev",
				s3Url: "https://honorvet-dev.s3.us-east-1.amazonaws.com/",
				directories: {
					users: "users/",
					admin: "admin/",
					recruiter: "recruiter/",
					comman: "comman/",
				},
			},
			SQS: {
				secondaryTasks:
					"https://sqs.us-east-1.amazonaws.com/652598225060/dev-secondaryTasks",
			},
		},
		PROD: {
			accessKeyId: "",
			secretAccessKey: "",
			awsRegion: "",
			S3: {
				bucket: "",
				s3Url: "",
				directories: {
					users: "users/",
					admin: "admin/",
					recruiter: "recruiter/",
					comman: "comman/",
					csv: "csv/",
				},
			},
			SQS: {
				secondaryTasks:
					"https://sqs.us-east-1.amazonaws.com/652598225060/prod-secondaryTasks",
			},
		},
		DEV: {
			accessKeyId: "AKIAZP4PCVCSPXFICMZH",
			secretAccessKey: "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",
			awsRegion: "us-east-1",
			S3: {
				bucket: "honorvet-dev",
				s3Url: "https://honorvet-dev.s3.us-east-1.amazonaws.com/",
				directories: {
					users: "users/",
					admin: "admin/",
					recruiter: "recruiter/",
					comman: "comman/",
				},
			},
			SQS: {
				secondaryTasks:
					"https://sqs.us-east-1.amazonaws.com/652598225060/dev-secondaryTasks",
			},
		},
		STAGE: {
			accessKeyId: "AKIAZP4PCVCSPXFICMZH",
			secretAccessKey: "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",
			awsRegion: "us-east-1",
			S3: {
				bucket: "honorvet-dev",
				s3Url: "https://honorvet-dev.s3.us-east-1.amazonaws.com/",
				directories: {
					users: "users/",
					admin: "admin/",
					recruiter: "recruiter/",
					comman: "comman/",
				},
			},
			SQS: {
				secondaryTasks:
					"https://sqs.us-east-1.amazonaws.com/652598225060/stage-secondaryTasks",
			},
		},
	},
	DATABASE: {
		LOCAL: {
			host: "localhost",
			name: "honorvet",
			// name: "honvert_vaneet_new",
			user: "root",
			password: "",
		},
		PROD: {
			host: "localhost",
			name: "honorvet_prod",
			user: "admin",
			password: "admin",
		},
		DEV: {
			host: "honorvetdb.cluster-cjfzbb4hrydr.us-east-1.rds.amazonaws.com",
			name: "honorvet_dev",
			user: "devdbuser",
			password: "24oC9dtPdYOAgSTS",
		},
		STAGE: {
			host: "honorvetdb.cluster-cjfzbb4hrydr.us-east-1.rds.amazonaws.com",
			name: "honorvet_stagedb",
			user: "devdbuser",
			password: "24oC9dtPdYOAgSTS",
		},
	},
	EMAIL: {
		LOCAL: {
			MAIL_SERVICE: "Gmail",
			FROM_EMAIL: "test@applify.co",
			HOST: "smtp.gmail.com",
			PORT: 587,
			SMTP_CREDENTIALS: {
				email: "test@applify.co",
				password: "mBh5nW%aXenD6aN&",
			},
		},
		PROD: {
			MAIL_SERVICE: "Gmail",
			FROM_EMAIL: "",
			SMTP_CREDENTIALS: {
				email: "",
				password: "",
			},
		},
		DEV: {
			MAIL_SERVICE: "Gmail",
			FROM_EMAIL: "test@applify.co",
			HOST: "smtp.gmail.com",
			PORT: 587,
			SMTP_CREDENTIALS: {
				email: "test@applify.co",
				password: "mBh5nW%aXenD6aN&",
			},
		},
		STAGE: {
			MAIL_SERVICE: "Gmail",
			FROM_EMAIL: "test@applify.co",
			HOST: "smtp.gmail.com",
			PORT: 587,
			SMTP_CREDENTIALS: {
				email: "test@applify.co",
				password: "mBh5nW%aXenD6aN&",
			},
		},
	},
	FCM: {
		LOCAL: {
			SERVER_KEY:
				"AAAA803ZmE8:APA91bFRSwHrG0y5KQTCbktbcPP7Du1tfyaky3ohyGiEAmnflOmj72fxlOhyqqhzA7C6U7wmmfLrngeU-8jrTNb1ejczmsYz1uuuLCOYwNfTNgJpsejVfsrXRWJnQT8eM7QT3JhKCBVG",
		},
		STAGE: {
			SERVER_KEY:
				"AAAA803ZmE8:APA91bFRSwHrG0y5KQTCbktbcPP7Du1tfyaky3ohyGiEAmnflOmj72fxlOhyqqhzA7C6U7wmmfLrngeU-8jrTNb1ejczmsYz1uuuLCOYwNfTNgJpsejVfsrXRWJnQT8eM7QT3JhKCBVG",
		},
		PROD: {
			SERVER_KEY:
				"AAAA803ZmE8:APA91bFRSwHrG0y5KQTCbktbcPP7Du1tfyaky3ohyGiEAmnflOmj72fxlOhyqqhzA7C6U7wmmfLrngeU-8jrTNb1ejczmsYz1uuuLCOYwNfTNgJpsejVfsrXRWJnQT8eM7QT3JhKCBVG",
		},
		DEV: {
			SERVER_KEY:
				"AAAA803ZmE8:APA91bFRSwHrG0y5KQTCbktbcPP7Du1tfyaky3ohyGiEAmnflOmj72fxlOhyqqhzA7C6U7wmmfLrngeU-8jrTNb1ejczmsYz1uuuLCOYwNfTNgJpsejVfsrXRWJnQT8eM7QT3JhKCBVG",
		},
	},
	TWILIO: {
		LOCAL: {
			accountSid: "AC20f9c149d1428f3fc30a45a19eff7b7b",
			authToken: "0c7351b31be2b691debfa4180af323b8",
			accountPhone: "+16204104531",
		},
		PROD: {
			accountSid: "AC20f9c149d1428f3fc30a45a19eff7b7b",
			authToken: "0c7351b31be2b691debfa4180af323b8",
			accountPhone: "+16204104531",
		},
		DEV: {
			accountSid: "AC20f9c149d1428f3fc30a45a19eff7b7b",
			authToken: "0c7351b31be2b691debfa4180af323b8",
			accountPhone: "+16204104531",
		},
		STAGE: {
			accountSid: "AC20f9c149d1428f3fc30a45a19eff7b7b",
			authToken: "0c7351b31be2b691debfa4180af323b8",
			accountPhone: "+16204104531",
		},
	},
	STRIPE: {
		LOCAL: {
			secretKey:
				"sk_test_51MhDUDFGzVjaUNdaackpAsooSZK0O9npZaB3ZrPQqJDAAM0y10LuAUCcTQAmFTMj8lFVi6frbh44YCArwa4S2maX00SY8wal4F",
			publishableKey:
				"pk_test_51MhDUDFGzVjaUNdauwkHavFTPm6JLl1AStYVKzLM8BFz93SHSNheMPRdaPFrLIVSnjBY9KyRRfRYpW4VwGUwOpzk00sRDA57Nw",
		},
		PROD: {
			secretKey:
				"sk_test_51MhDUDFGzVjaUNdaackpAsooSZK0O9npZaB3ZrPQqJDAAM0y10LuAUCcTQAmFTMj8lFVi6frbh44YCArwa4S2maX00SY8wal4F",
			publishableKey:
				"pk_test_51MhDUDFGzVjaUNdauwkHavFTPm6JLl1AStYVKzLM8BFz93SHSNheMPRdaPFrLIVSnjBY9KyRRfRYpW4VwGUwOpzk00sRDA57Nw",
		},
		DEV: {
			secretKey:
				"sk_test_51MhDUDFGzVjaUNdaackpAsooSZK0O9npZaB3ZrPQqJDAAM0y10LuAUCcTQAmFTMj8lFVi6frbh44YCArwa4S2maX00SY8wal4F",
			publishableKey:
				"pk_test_51MhDUDFGzVjaUNdauwkHavFTPm6JLl1AStYVKzLM8BFz93SHSNheMPRdaPFrLIVSnjBY9KyRRfRYpW4VwGUwOpzk00sRDA57Nw",
		},
		STAGE: {
			secretKey:
				"sk_test_51MhDUDFGzVjaUNdaackpAsooSZK0O9npZaB3ZrPQqJDAAM0y10LuAUCcTQAmFTMj8lFVi6frbh44YCArwa4S2maX00SY8wal4F",
			publishableKey:
				"pk_test_51MhDUDFGzVjaUNdauwkHavFTPm6JLl1AStYVKzLM8BFz93SHSNheMPRdaPFrLIVSnjBY9KyRRfRYpW4VwGUwOpzk00sRDA57Nw",
		},
	},
	SERVER: {
		LOCAL: {
			PORT: 3000,
		},
		DEV: {
			PORT: 3000,
		},
		STAGE: {
			PORT: 3001,
		},
		PROD: {
			PORT: 3000,
		},
	},
	CHATTABLE: {
		LOCAL: {
			notifications: "Notifications",
		},
		PROD: {
			notifications: "Notifications_Live",
		},
		STAGE: {
			notifications: "Notifications",
		},
		DEV: {
			notifications: "Notifications",
		},
	},
	PAGESURL: {
		LOCAL: {
			termsUrl: "https://honorvets.com/terms.html",
			privacyUrl: "https://honorvets.com/privacy-policy.html",
		},
		PROD: {
			termsUrl: "https://honorvets.com/terms.html",
			privacyUrl: "https://honorvets.com/privacy-policy.html",
		},
		STAGE: {
			termsUrl: "https://honorvets.com/terms.html",
			privacyUrl: "https://honorvets.com/privacy-policy.html",
		},
		DEV: {
			termsUrl: "https://honorvets.com/terms.html",
			privacyUrl: "https://honorvets.com/privacy-policy.html",
		},
	},
};
module.exports = globalConstants;
