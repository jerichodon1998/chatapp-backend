import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, unique: true },
	username: { type: String, required: true },
	channels: { type: [Schema.Types.ObjectId] },
});

const User = model<IUser>("User", userSchema);

// create collection if it doesn't exist
// 		Apply options:
// 			enable changeStreamPreAndPostImages (for real time updates)
User.createCollection({
	changeStreamPreAndPostImages: { enabled: true },
})
	.then((col) => {
		const { collectionName } = col;
		console.log(`${collectionName} collection created`);
	})
	.catch((e) => console.log(e));

export default User;
