import Message from "../../../models/Message";
import { ICallbackResponse } from "../../../types/socket";

export const messageUpdateHandler = async (
	payload: IEditMessageSocketPayload,
	callback: ICallbackResponse
) => {
	const { messageId, content } = payload;

	try {
		await Message.findByIdAndUpdate(messageId, {
			$set: { content: content },
		});

		return callback({ status: 200, message: "Message updated!" });
	} catch (error) {
		console.log(error);
		return callback({ status: 500, message: "Something went wrong!" });
	}
};
