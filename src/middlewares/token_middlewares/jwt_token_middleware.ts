import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { decodeToken } from "../../helpers/token_helper";
import Message from "../../models/Message";
import { ObjectId } from "mongodb";

const JWT_KEY =
	process.env.ENV === "production" ? process.env.JWT_KEY : "secretkey";

export const verifyToken: RequestHandler = async (req, res, next) => {
	const { Bearer } = req.cookies;
	// verify token
	if (Bearer) {
		try {
			jwt.verify(Bearer, JWT_KEY);

			next();
		} catch (error) {
			console.log(error);
			return res.status(403).json({ message: "Forbidden" });
		}
	} else {
		console.log("No Token");
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
			const decodedToken = decodeToken(req);
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

export const verifyDeleterToken: RequestHandler<
	IDeleteMessageReqParam,
	{},
	{}
> = async (req, res, next) => {
	const { messageId } = req.params;

	// verify token
	const decoded = decodeToken(req);

	// query message if exist and fetch only its authorId
	const message = await Message.findById(messageId, { authorId: 1 });

	if (message && message.authorId === new ObjectId(decoded._id)) {
		next();
	} else {
		return res.status(404).json({ message: "Message not found" });
	}
};
