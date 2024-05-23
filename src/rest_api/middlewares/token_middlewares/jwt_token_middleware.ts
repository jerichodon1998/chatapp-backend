import { RequestHandler } from "express";
import { verifyJwtToken } from "../../../helpers/token_helper";
import Message from "../../../models/Message";
import Channel from "../../../models/Channel";
import mongoose from "mongoose";
import {
	IDeleteMessageReqParam,
	IEditMessageReqParam,
	ISendMessageReqBody,
} from "MessageTypes";
import { IFetchChannelReqParam } from "ChannelTypes";
import { IDeleteAccountRequestParams } from "UserTypes";

export const verifyToken: RequestHandler = async (req, res, next) => {
	// verify token
	try {
		verifyJwtToken(req);

		next();
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "Forbidden" });
	}
};

// verify and checks if the requester is the owner of the account being deleted
export const verifyAccountDeleterToken: RequestHandler<
	IDeleteAccountRequestParams
> = (req, res, next) => {
	const { Bearer } = req.cookies;
	if (!Bearer) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const decodedToken = verifyJwtToken(req);
		decodedToken._id === req.params.uid
			? next()
			: res.status(401).json({ message: "Unauthorized" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: "Unauthorized" });
	}
};

// checks if the author id and the token payload id is the same
// The sender matches the id from the decoded access token
export const verifySenderToken: RequestHandler<{}, {}, ISendMessageReqBody> = (
	req,
	res,
	next
) => {
	const { Bearer } = req.cookies;
	// check if token exist
	if (Bearer) {
		try {
			// verify token
			const decodedToken = verifyJwtToken(req);
			// The sender should match the id from the decoded access token
			// return 403 if not
			if (decodedToken._id === req.body.authorId) {
				next();
			} else {
				return res.status(403).json({ message: "Forbidden" });
			}
		} catch (error) {
			console.log(error);
			return res.status(403).json({ message: "Forbidden" });
		}
	} else {
		console.log("No Token");
		return res.status(403).json({ message: "Forbidden" });
	}
};

// NOTE - verifyDeleterToken and verifyEditorToken have the same implementation
// 		- these functions will vary later on as this application progress
// TODO - Delete this note after functions vary from each other
export const verifyDeleterToken: RequestHandler<
	IDeleteMessageReqParam,
	{},
	{}
> = async (req, res, next) => {
	const { messageId } = req.params;

	// verify token
	const decoded = verifyJwtToken(req);

	// query message if exist and fetch only its authorId
	const message = await Message.findById(messageId, { authorId: 1 });

	// decoded id from deleter token should match the message author id
	if (message && message.authorId.toString() === decoded._id) {
		next();
	} else {
		return res.status(404).json({ message: "Forbidden" });
	}
};

// NOTE - verifyDeleterToken and verifyEditorToken have the same implementation
// 		- these functions will vary later on as this application progress
// TODO - Delete this note after functions vary from each other
export const verifyEditorToken: RequestHandler<IEditMessageReqParam> = async (
	req,
	res,
	next
) => {
	const { messageId } = req.params;

	// verify token
	const decoded = verifyJwtToken(req);

	// query message if exist and fetch only its authorId
	const message = await Message.findById(messageId, { authorId: 1 });

	// decoded id from deleter token should match the message author id
	if (message && message.authorId.toString() === decoded._id) {
		next();
	} else {
		return res.status(403).json({ message: "Forbidden" });
	}
};

// verifies if the requester is a member of the channel
export const verifyChannelMember: RequestHandler<
	IFetchChannelReqParam
> = async (req, res, next) => {
	const { channelId } = req.params;
	try {
		// verify and decode token
		const decoded = verifyJwtToken(req);

		// query channel with the channelId and if the user's id (from the jwt payload) is included in the members' list
		const channelObjectId = new mongoose.Types.ObjectId(channelId);
		const userObjectId = new mongoose.Types.ObjectId(decoded._id);
		const channel = await Channel.findOne({
			_id: channelObjectId,
			members: { $in: userObjectId },
		});

		// if channel is not empty go to next()
		// else return 403
		if (channel) {
			next();
		} else {
			return res.status(403).json({ message: "Forbidden" });
		}
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "Forbidden" });
	}
};
