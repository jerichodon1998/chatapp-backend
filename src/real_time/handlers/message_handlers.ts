import mongoose from "mongoose";
import Channel from "../../models/Channel";
import User from "../../models/User";
import Message from "../../models/Message";
import messageNamespace from "../namespaces/messages/message_namespace";

export const messageHandler = async (
	payload: ISendMessageReqBody,
	callback: (response: { status: number; message: string }) => void
) => {
	const { authorId, content, channelId } = payload;
	const messagenp = messageNamespace.getNamespace();

	try {
		const author = await User.findById(authorId, { _id: 1 });

		if (!author) {
			return callback({ status: 400, message: "User doesn't exist" });
		}

		// thi query checks if the author is in the members list, if not, it will return an error
		const channel = await Channel.findOne({
			_id: new mongoose.Types.ObjectId(channelId),
			members: { $in: [author._id] },
		});

		if (!channel) {
			return callback({
				status: 400,
				message: "Channel doesn't exist or User is forbidden",
			});
		}

		const createdMessage = await Message.create({
			authorId: author._id,
			channelId: channel._id,
			content: content,
		});

		messagenp.emit("message", createdMessage);
		return callback({ status: 201, message: "Message sent" });
	} catch (error) {
		console.log(error);
		return callback({ status: 500, message: "Something went wrong" });
	}
};
