import { Socket } from "socket.io";
import { verifyJwtToken } from "../../../helpers/token_helper";

export default (
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
			messageSendMiddleware(args, next, socket);
			break;

		default:
			console.log(`Event '${event}' has no middleware`);
			break;
	}
};

const messageSendMiddleware = (
	args: any[],
	next: (err?: Error) => void,
	socket: Socket
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
