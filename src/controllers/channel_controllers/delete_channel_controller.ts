import { RequestHandler, Response } from "express";
import mongoose from "mongoose";
import Message from "../../models/Message";
import Channel from "../../models/Channel";

// delete channel along with messages linked to it applying transaction
const deleteChannelTransaction = async (channelId: string, res: Response) => {
	// start session
	const session = await mongoose.startSession();

	// start transaction
	session.startTransaction();

	// delete channel along with messages linked to it
	try {
		// fetch channel if exist, just its ID
		const channel = await Channel.findById(
			channelId,
			{ _id: 1 },
			{ session: session }
		);

		if (!channel) {
			throw Error("channel does not exist");
		}

		// delete
		await Message.deleteMany({ channelId: channelId }, { session: session });
		await Channel.findByIdAndDelete(channel._id, { session: session });

		// commit transaction and end session
		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({ message: "Channel deleted" });
	} catch (error) {
		// catch error and end session
		await session.abortTransaction();
		session.endSession();

		return res.status(500).json({ message: "Something went wrong" });
	}
};

const deleteChannelController: RequestHandler<{ channelId: string }> = async (
	req,
	res
) => {
	const { channelId } = req.params;

	return await deleteChannelTransaction(channelId, res);
};

export default deleteChannelController;
