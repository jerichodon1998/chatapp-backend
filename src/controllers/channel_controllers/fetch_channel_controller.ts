import { RequestHandler } from "express";
import Channel from "../../models/Channel";
import mongoose from "mongoose";

const fetchChannelController: RequestHandler<{ channelId: string }> = async (
	req,
	res
) => {
	const { channelId } = req.params;

	// check if channel exist
	const channel = await Channel.findById(channelId);

	if (!channel) {
		return res.status(404).json({ message: "Channel doesn't exist" });
	}

	// perform aggregation of channel with messages
	const db = mongoose.connection.db.collection("channels");

	const data = await db
		.aggregate([
			{ $match: { _id: channel._id } },
			{
				$lookup: {
					from: "messages",
					localField: "_id",
					foreignField: "channelId",
					as: "messages",
				},
			},
		])
		.toArray();

	return res.status(200).json(data);
};

export default fetchChannelController;
