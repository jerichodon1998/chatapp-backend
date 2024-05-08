import { IMessage } from "MessageTypes";
import { Schema, model } from "mongoose";

const messageSchema = new Schema<IMessage>({
	authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	channelId: { type: Schema.Types.ObjectId, required: true, ref: "Channel" },
	content: { type: String, required: true },
});

const Message = model<IMessage>("Message", messageSchema);

// create collection if it doesn't exist
// 		Apply options:
// 			enable changeStreamPreAndPostImages (for real time updates)
Message.createCollection({
	changeStreamPreAndPostImages: { enabled: true },
})
	.then((col) => {
		const { collectionName } = col;
		console.log(`${collectionName} collection created`);
	})
	.catch((e) => console.log(e));

export default Message;
