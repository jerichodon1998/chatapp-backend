import { Schema, model } from "mongoose";

const channelSchema = new Schema<IChannel>({
	admins: { type: [Schema.Types.ObjectId], ref: "User" },
	members: { type: [Schema.Types.ObjectId], required: true, ref: "User" },
	channelType: { type: String, required: true },
});

const Channel = model<IChannel>("Channel", channelSchema);

export default Channel;
