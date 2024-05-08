import { IDeleteMessageSocketPayload } from "MessageTypes";
import Message from "../../../models/Message";
import { ICallbackResponse } from "SocketTypes";

export const messageDeleteHandler = async (
	payload: IDeleteMessageSocketPayload,
	callback: ICallbackResponse
) => {
	const { messageId } = payload;

	try {
		// check if message exist
		await Message.findByIdAndDelete(messageId);

		return callback({ status: 200, message: "Message deleted" });
	} catch (error) {
		console.log(error);
		return callback({ status: 500, message: "Something went wrong" });
	}
};
