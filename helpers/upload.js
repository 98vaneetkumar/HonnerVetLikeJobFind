"use strict";
const AWS = require("aws-sdk");
const env = require("../config/env")();
const path = require("path");
const randomstring = require("randomstring");
let fs = require("fs");


AWS.config.update({
	accessKeyId: env.AWS.accessKeyId,
	secretAccessKey: env.AWS.secretAccessKey,
	region: env.AWS.awsRegion
});
const s3 = new AWS.S3();
const S3Bucket = env.AWS.S3.bucket;
// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 900;

exports.getS3UploadURL = async function (payload) {
	const randomID = parseInt(Math.random() * 10000000).toString();
	let fileExtension = payload.fileName.split(".")[payload.fileName.split(".").length - 1];
	const Key = `${payload.folder}${randomID}.${fileExtension}`;
	let contentType = "image/jpeg";
	if (fileExtension == "mp4") contentType = "video/mp4";
	if (fileExtension == "png") contentType = "image/png";
	// Get signed URL from S3
	const s3Params = {
		Bucket: S3Bucket,
		Key,
		Expires: URL_EXPIRATION_SECONDS,
		ContentType: contentType,
		ACL: "public-read"
	};

	try {
		const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
		return {
			uploadURL: uploadURL,
			fileName: `${randomID}.${fileExtension}`,
			thumbnail: `${randomID}.jpg`,
			Key
		};
	}
	catch (err) {
		console.log(err);
		throw err;
	}

};

exports.putObjectToS3 = (req, directory, contentType) => {
	return new Promise((resolve, reject) => {
		const file = req.files["file"];
		console.log("checking:::::::::: ", file);
		const extension = path.extname(file.name);
		const key = randomstring.generate(7) + new Date().getMilliseconds() + extension;
		const params = {
			Body: fs.readFileSync(file.path),
			Bucket: S3Bucket,
			Key: directory+key,
			ContentType: contentType,
		};
		s3.putObject(params, function (err, data) {
			if (err) {
				reject(err);
			} else {
				const result = {
					fileName: key,
					folder: directory,
					data,
				};
				resolve(result);
			}
		});
	});
};

exports.deleteObjectFromS3 = (key) => {
	return new Promise((resolve, reject) => {
		s3.deleteObject({ Bucket: S3Bucket, Key: key }, function (err, data) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				console.log(
					"Successfully deleted file from bucket"
				);
				console.log(data);
				resolve(data);
			}
		});
	});
};

exports.s3 = s3;