
const _ = require("underscore");
// const moment = require("moment");
const Joi = require("joi");
const Response = require("../../config/response");
const commonHelper = require("../../helpers/common");
const message = require("../../config/messages");
const Services = require("../../services");
const Model = require("../../models");
const Projection = ["id", "groupName", "groupDescription","createJob","viewTeamMemberJob","editTeamMemberJob",
	"addTeamMember","editTeamMember","deleteTeamMember","viewActivePlans","buyInventory","viewInvoice","cancelSubscription","createdAt","isBlocked"];
module.exports = {
	getAllGroupPermissions: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isActive: Joi.number().optional(),
			groupPermissions: Joi.string().optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let result ={};
		result.groupPermission = await Services.GroupPermission.getAllGroupPermissions(payload, Projection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		result.count = await Services.GroupPermission.count(payload);
		return result;
	},
	getGroupPermissionById: async(paramData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required()
		});
		let payload = await commonHelper.verifyJoiSchema(paramData, schema);
		let criteria = {
			id: payload.id,
		};
		let groupPermission = Services.GroupPermission.getGroupPermission(criteria, Projection, true);
		if (groupPermission) {
			return groupPermission;
		} else {
			throw Response.error_msg.recordNotFound;
		}
	},
	addGroupPermission: async(payloadData) => {
		const schema = Joi.object().keys({
			recruiterId: Joi.string().optional(),
			groupName: Joi.string().optional(),
			groupDescription: Joi.string().optional(),
			createJob: Joi.number().valid(0, 1).optional(),
			viewTeamMemberJob: Joi.number().valid(0, 1).optional(),
			editTeamMemberJob: Joi.number().valid(0, 1).optional(),
			addTeamMember: Joi.number().valid(0, 1).optional(),
			editTeamMember: Joi.number().valid(0, 1).optional(),
			deleteTeamMember: Joi.number().valid(0, 1).optional(),
			viewActivePlans: Joi.number().valid(0, 1).optional(),
			buyInventory: Joi.number().valid(0, 1).optional(),
			viewInvoice: Joi.number().valid(0, 1).optional(),
			cancelSubscription: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let objToSave = {};
		if (_.has(payload, "groupName") && payload.groupName != "") objToSave.groupName = payload.groupName;
		if (_.has(payload, "groupDescription") && payload.groupDescription != "") objToSave.groupDescription = payload.groupDescription;
		if (_.has(payload, "createJob")) objToSave.createJob = payload.createJob;
		if (_.has(payload, "viewTeamMemberJob")) objToSave.viewTeamMemberJob = payload.viewTeamMemberJob;
		if (_.has(payload, "editTeamMemberJob")) objToSave.editTeamMemberJob = payload.editTeamMemberJob;
		if (_.has(payload, "addTeamMember")) objToSave.addTeamMember = payload.addTeamMember;
		if (_.has(payload, "editTeamMember")) objToSave.editTeamMember = payload.editTeamMember;
		if (_.has(payload, "deleteTeamMember")) objToSave.deleteTeamMember = payload.deleteTeamMember;
		if (_.has(payload, "viewActivePlans")) objToSave.viewActivePlans = payload.viewActivePlans;
		if (_.has(payload, "buyInventory")) objToSave.buyInventory = payload.buyInventory;
		if (_.has(payload, "viewInvoice")) objToSave.viewInvoice = payload.viewInvoice;
		if (_.has(payload, "cancelSubscription")) objToSave.cancelSubscription = payload.cancelSubscription;
		objToSave.recruiterId=payloadData.recruiterId;
		let addGroup = await Services.GroupPermission.addGroup(objToSave);
		if (addGroup) {
			return message.success.ADDED;
		} else throw Response.error_msg.implementationError;
	},
	updateGroupPermission: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			recruiterId: Joi.string().optional(),
			groupName: Joi.string().optional(),
			groupDescription: Joi.string().optional(),
			createJob: Joi.number().valid(0, 1).optional(),
			viewTeamMemberJob: Joi.number().valid(0, 1).optional(),
			editTeamMemberJob: Joi.number().valid(0, 1).optional(),
			addTeamMember: Joi.number().valid(0, 1).optional(),
			editTeamMember: Joi.number().valid(0, 1).optional(),
			deleteTeamMember: Joi.number().valid(0, 1).optional(),
			viewActivePlans: Joi.number().valid(0, 1).optional(),
			buyInventory: Joi.number().valid(0, 1).optional(),
			viewInvoice: Joi.number().valid(0, 1).optional(),
			cancelSubscription: Joi.number().valid(0, 1).optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let condition = {
			id: payload.id,
		};
		let objToSave = {};
		if (_.has(payload, "groupName") && payload.groupName != "") objToSave.groupName = payload.groupName;
		if (_.has(payload, "groupDescription") && payload.groupDescription != "") objToSave.groupDescription = payload.groupDescription;
		if (_.has(payload, "createJob")) objToSave.createJob = payload.createJob;
		if (_.has(payload, "viewTeamMemberJob")) objToSave.viewTeamMemberJob = payload.viewTeamMemberJob;
		if (_.has(payload, "editTeamMemberJob")) objToSave.editTeamMemberJob = payload.editTeamMemberJob;
		if (_.has(payload, "addTeamMember")) objToSave.addTeamMember = payload.addTeamMember;
		if (_.has(payload, "editTeamMember")) objToSave.editTeamMember = payload.editTeamMember;
		if (_.has(payload, "deleteTeamMember")) objToSave.deleteTeamMember = payload.deleteTeamMember;
		if (_.has(payload, "viewActivePlans")) objToSave.viewActivePlans = payload.viewActivePlans;
		if (_.has(payload, "buyInventory")) objToSave.buyInventory = payload.buyInventory;
		if (_.has(payload, "viewInvoice")) objToSave.viewInvoice = payload.viewInvoice;
		if (_.has(payload, "cancelSubscription")) objToSave.cancelSubscription = payload.cancelSubscription;
		if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
		if (_.has(payload, "isDeleted")) objToSave.isDeleted = payload.isDeleted;
		objToSave.recruiterId=payloadData.recruiterId;
		let updateGroup = await Services.GroupPermission.updateGroupPermission(condition, objToSave);
		if (updateGroup) {
			return message.success.UPDATED;
		} else throw Response.error_msg.implementationError;
	},

	getAllGroupManageUsers: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			limit: Joi.number().optional(),
			skip: Joi.number().optional(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isActive: Joi.number().optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let criteria = {
			id: payload.id,
		};
		console.log("criteria==>",criteria);
		let result ={};
		result.count = await Services.GroupPermission.usersCount(payload);
		result.listing = await Services.GroupPermission.getAllRecruiterUsers(payload, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		return result;
	},

	userGroupPermissionDelete: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			// recruiterId: Joi.string().optional(),
			isBlocked: Joi.number().valid(0, 1).optional(),
			isDeleted: Joi.number().valid(0, 1).optional(),
			select: Joi.number().valid(0,1).optional()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let condition = {
			id: payload.id
		};
		let objToSave = {};
		if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
		if (_.has(payload, "isDeleted")) objToSave.isDeleted = payload.isDeleted;
		if (_.has(payload, "select")) objToSave.select = payload.select;
		let updateGroup = await Services.GroupPermission.deleteGroupPermission(condition, objToSave);
		if (updateGroup) {
			return message.success.UPDATED;
		} else throw Response.error_msg.implementationError;
	},

	addUserGroup: async(payloadData) => {
		const schema = Joi.object().keys({
			groupPermissionId: Joi.string().optional(),
			userIds: Joi.array().items({
				recruiterUserId: Joi.string().optional(),
				select: Joi.number().valid(0, 1).optional(),
			}),
			// userIds: Joi.array().items(Joi.object()).optional()
			// userIds: Joi.number().valid(0, 1).optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

		let objToSave = {};
		const promises = payload.userIds.map(async (userId) => {
			objToSave.recruiterUserId = userId.recruiterUserId;
			objToSave.groupPermissionId = payload.groupPermissionId;
			await Services.JobPostService.hardDelete(Model.AssignUserGroup, objToSave);
			
		});
		let data= await Promise.all(promises);
		// const result = {};
		const assignGroup = payload.userIds.map(value => ({...value, groupPermissionId: payload.groupPermissionId}));
		const addAssignGroup = await Services.JobPostService.saveBulkCreate(Model.AssignUserGroup, assignGroup);
		return {
			addAssignGroup: addAssignGroup
		};
	},
};