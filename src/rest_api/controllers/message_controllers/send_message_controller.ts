import { RequestHandler, Response } from "express";
import mongoose from "mongoose";
import User from "../../../models/User";
import Channel from "../../../models/Channel";
import Message from "../../../models/Message";
import { ISendMessageReqBody } from "MessageTypes";

const sendMessageController: RequestHandler<
	{},
	{},
	ISendMessageReqBody
> = async (req, res) => {
	const { authorId, channelId, channelType, content, recipientId } = req.body;

	// check authorId, content, and channelType
	if (!authorId || !channelType || !content) {
		return res.status(400).json({ message: "Invalid Message object format" });
	}

	// If no channelId is given, recipient should exist and use it to create new channel
	// And use transaction
	if (!channelId && recipientId && channelType === "direct") {
		return await channelMessageTransaction(
			authorId,
			channelType,
			content,
			recipientId,
			res
		);
	}
	// send message linked to channel
	else {
		// check if user and channel exist and get ids
		try {
			const author = await User.findById(authorId, { _id: 1 });

			if (!author) {
				return res.status(400).json({ message: "User doesn't exist" });
			}

			// thi query checks if the author is in the members list, if not, it will return an error
			const channel = await Channel.findOne({
				_id: new mongoose.Types.ObjectId(channelId),
				members: { $in: [author._id] },
			});

			if (!channel) {
				return res
					.status(400)
					.json({ message: "Channel doesn't exist or User is forbidden" });
			}

			await Message.create({
				authorId: author._id,
				channelId: channel._id,
				content: content,
			});

			return res.status(201).json({ message: "Message sent" });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	}
};

// creates a channel and linked the message to it
const channelMessageTransaction = async (
	authorId: string,
	channelType: string,
	content: string,
	recipientId: string,
	res: Response
) => {
	// check if both users exist
	const author = await User.findById(authorId);
	const recipient = await User.findById(recipientId);

	if (!author || !recipient) {
		return res.status(400).json({ message: "User(s) doesn't exist" });
	}

	// store both id in a const and sorted - NOTE for searching optimization (Theoritically and not proven)
	const membersId = [author._id, recipient._id].sort();

	// start session
	const session = await mongoose.startSession();

	// start transaction
	session.startTransaction();

	// message and channel transaction
	try {
		// create channel
		const channel = await Channel.create(
			[
				{
					members: membersId,
					channelType: channelType,
				},
			],
			{ session: session }
		);

		// create message and link it to channel
		await Message.create(
			[
				{
					authorId: author?._id,
					channelId: channel[0]._id,
					content: content,
				},
			],
			{ session: session }
		);

		// commit transaction and end session
		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({ message: "Message sent" });
	} catch (error) {
		// catch error and end session
		await session.abortTransaction();
		session.endSession();

		return res.status(500).json({ message: "Something went wrong" });
	}
};

export default sendMessageController;
