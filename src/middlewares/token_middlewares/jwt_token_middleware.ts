import { RequestHandler } from "express";
import { verifyJwtToken } from "../../helpers/token_helper";
import Message from "../../models/Message";
import { ObjectId } from "mongodb";

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
	if (message && message.authorId === new ObjectId(decoded._id)) {
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
	if (message && message.authorId === new ObjectId(decoded._id)) {
		next();
	} else {
		return res.status(403).json({ message: "Forbidden" });
	}
};
