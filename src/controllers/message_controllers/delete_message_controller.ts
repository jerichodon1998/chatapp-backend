import { RequestHandler } from "express";
import Message from "../../models/Message";

const deleteMessageController: RequestHandler<{ messageId: string }> = async (
	req,
	res
) => {
	const { messageId } = req.params;

	try {
		// check if message exist
		await Message.findByIdAndDelete(messageId);

		return res.status(200).json({ message: "Message deleted" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export default deleteMessageController;
