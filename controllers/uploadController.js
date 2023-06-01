"use strict";
const AWS = require("aws-sdk");
const Joi = require("joi");
let commonHelper = require("../helpers/common");
let uploadHelper = require("../helpers/upload");

let env = require("../config/env")();
AWS.config.update({
	accessKeyId: env.AWS.accessKeyId,
	secretAccessKey: env.AWS.secretAccessKey,
	region: env.AWS.awsRegion
});
const s3 = new AWS.S3();
const S3Bucket = env.AWS.S3.bucket;
// Change this value to adjust the signed URL"s expiration
const URL_EXPIRATION_SECONDS = 36000; // 10 minutes
module.exports = {
	getS3UploadURL: async(formData) => {
		const randomID = parseInt(Math.random() * 100000, 10);
		const schema = Joi.object().keys({
			directory: Joi.string().required(),
			fileName: Joi.string().required(),
			contentType: Joi.string().optional().allow("")
		});
		let payload = await commonHelper.verifyJoiSchema(formData, schema);
		let fileExtension = payload.fileName.split(".")[payload.fileName.split(".").length - 1];
		const Key = `${payload.directory}${randomID}.${fileExtension}`;
		let contentType = "image/jpeg";
		if (payload.contentType) {
			contentType = payload.contentType;
		}
		if (fileExtension == "mp4") contentType = "video/mp4";
		if (fileExtension == "png") contentType = "image/png";
		const s3Params = {
			Bucket: S3Bucket,
			Key,
			Expires: URL_EXPIRATION_SECONDS,
			ContentType: contentType
		};
			// ACL: "public-read"
		try {
			const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
			let data = {
				uploadURL: uploadURL,
				fileName: `${randomID}.${fileExtension}`,
				Key
			};
			if (fileExtension == "mp4") {
				data.thumbnail = `${randomID}.jpg`;
			}
			return data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	uploadObjectToS3: async(req) => {
		const schema = Joi.object().keys({
			directory: Joi.string().required(),
			contentType: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(req.body, schema);
		let data = await uploadHelper.putObjectToS3(req, payload.directory, payload.contentType);
		return data;
	}
};