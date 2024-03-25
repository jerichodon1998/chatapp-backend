import { Schema, model } from "mongoose";

const messageSchema = new Schema<IMessage>({
	authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	channelId: { type: Schema.Types.ObjectId, required: true, ref: "Channel" },
	content: { type: String, required: true },
});

const Message = model<IMessage>("Message", messageSchema);

export default Message;
