import { IChannel } from "ChannelTypes";
import { Schema, model } from "mongoose";

const channelSchema = new Schema<IChannel>({
	admins: { type: [Schema.Types.ObjectId], ref: "User" },
	members: { type: [Schema.Types.ObjectId], required: true, ref: "User" },
	channelType: { type: String, required: true },
	directChannelMergedIds: { type: String, unique: true },
});

const Channel = model<IChannel>("Channel", channelSchema);

// create collection if it doesn't exist
// 		Apply options:
// 			enable changeStreamPreAndPostImages (for real time updates)
Channel.createCollection({
	changeStreamPreAndPostImages: { enabled: true },
})
	.then((col) => {
		const { collectionName } = col;
		console.log(`${collectionName} collection created`);
	})
	.catch((e) => console.log(e));

export default Channel;
