import { Schema, model } from "mongoose";

const messageSchema = new Schema<IMessage>({
	authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	channelId: { type: Schema.Types.ObjectId, required: true, ref: "Channel" },
	content: { type: String, required: true },
});

const Message = model<IMessage>("Message", messageSchema);

// TODO - create collection or update existing collection
// 			Apply options:
// 				enable changeStreamPreAndPostImages (for real time updates)

export default Message;
