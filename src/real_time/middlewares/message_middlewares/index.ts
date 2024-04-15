import { Socket } from "socket.io";
import { verifyJwtToken } from "../../../helpers/token_helper";
import Message from "../../../models/Message";

export default async (
	event: string,
	args: any[],
	next: (err?: Error) => void,
	socket: Socket
) => {
	// verify token here

	console.log(event);
	// apply middleware to corresponding event name
	switch (event) {
		case "message:send":
			await messageSendMiddleware(args, next, socket);
			break;
		case "message:delete":
			await messageDeleteMiddleware(args, next, socket);
			break;
		case "message:update":
			await messageUpdateMiddleware(args, next, socket);
			break;
		default:
			console.log(`Event '${event}' has no middleware`);
			break;
	}
};
type IMessageSocketMiddleware = (
	args: any[],
	next: (err?: Error) => void,
	socket: Socket
) => Promise<void>;
const messageSendMiddleware: IMessageSocketMiddleware = async (
	args,
	next,
	socket
) => {
	const payload: ISendMessageSocketPayload = args[0];
	const callback: ICallbackResponse = args[1];
	const Bearer = socket.handshake.headers.cookie?.split("=")[1];
	// check if token exist
	if (Bearer) {
		try {
			// verify token
			const decodedToken = verifyJwtToken(socket);
			// The sender should match the id from the decoded access token
			// return 403 if not
			if (decodedToken._id === payload.authorId) {
				next();
			} else {
				return callback({ status: 403, message: "Forbidden" });
			}
		} catch (error) {
			console.log(error);
			return callback({ status: 403, message: "Forbidden" });
		}
	} else {
		console.log("No Token");
		return callback({ status: 403, message: "Forbidden" });
	}
};

const messageDeleteMiddleware: IMessageSocketMiddleware = async (
	args,
	next,
	socket
) => {
	const payload: IDeleteMessageSocketPayload = args[0];
	const callback: ICallbackResponse = args[1];
	// verify token
	const decoded = verifyJwtToken(socket);

	// query message if exist and fetch only its authorId
	const message = await Message.findById(payload.messageId, { authorId: 1 });

	// decoded id from deleter token should match the message author id
	if (message && message.authorId.toString() === decoded._id) {
		next();
	} else {
		return callback({ status: 403, message: "Forbidden" });
	}
};

const messageUpdateMiddleware: IMessageSocketMiddleware = async (
	args,
	next,
	socket
) => {
	const payload: IEditMessageSocketPayload = args[0];
	const callback: ICallbackResponse = args[1];

	// verify token
	const decoded = verifyJwtToken(socket);

	// query message if exist and fetch only its authorId
	const message = await Message.findById(payload.messageId, { authorId: 1 });

	// decoded id from deleter token should match the message author id
	if (message && message.authorId.toString() === decoded._id) {
		next();
	} else {
		return callback({ status: 403, message: "Forbidden" });
	}
};
