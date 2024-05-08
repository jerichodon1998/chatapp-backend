import { RequestHandler } from "express";
import Message from "../../../models/Message";
import { IEditMessageReqParam } from "MessageTypes";

const updateMessageController: RequestHandler<
	IEditMessageReqParam,
	{},
	{ content: string }
> = async (req, res) => {
	const { messageId } = req.params;
	const { content } = req.body;

	try {
		await Message.findByIdAndUpdate(messageId, {
			$set: { content: content },
		});

		return res.status(200).json({ message: "Message updated!" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export default updateMessageController;
