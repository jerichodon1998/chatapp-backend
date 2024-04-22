import { Schema, model } from "mongoose";

// NOTE - mongodb indexes doesn't have a unique permutation on array elements.
// TODO - add a field where the two IDs of the members from a direct channelType
// 			be concatenated with '-' e.g. userId1-userId2 and create an index from it.
// NOTE - See also the TODO from the User's Model. I think either of one is a good solution.
// NOTE - This is related to 'improve join rooms' from message_namespace TODO
const channelSchema = new Schema<IChannel>({
	admins: { type: [Schema.Types.ObjectId], ref: "User" },
	members: { type: [Schema.Types.ObjectId], required: true, ref: "User" },
	channelType: { type: String, required: true },
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
