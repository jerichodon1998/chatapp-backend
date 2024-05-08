import { RequestHandler } from "express";
import Channel from "../../../models/Channel";
import { IFetchChannelReqParam } from "ChannelTypes";

const fetchChannelController: RequestHandler<IFetchChannelReqParam> = async (
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
	const data = await Channel.aggregate([
		{ $match: { _id: channel._id } },
		{
			$lookup: {
				from: "messages",
				localField: "_id",
				foreignField: "channelId",
				as: "messages",
			},
		},
	]).exec();

	return res.status(200).json(data);
};

export default fetchChannelController;
