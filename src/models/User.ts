import { Schema, model } from "mongoose";

// TODO - add field that holds all the channelId(s) that the user is involved in.
// NOTE - See also the TODO from the Channel's Model. I think either of one is a good solution.
// NOTE - This is related to 'improve join rooms' from message_namespace TODO
const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, unique: true },
	username: { type: String, required: true },
});

const User = model<IUser>("User", userSchema);

// TODO - create collection or update existing collection
// 			Apply options:
// 				enable changeStreamPreAndPostImages (for real time updates)

export default User;
