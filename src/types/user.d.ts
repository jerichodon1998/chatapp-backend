import { ObjectId } from "mongoose";

export interface IUserInfo {
	username: string;
	email: string;
	channels: ObjectId[];
}

export interface ISignin {
	email: string;
	password: string;
}

export interface ISignup extends IUserInfo {
	password: string;
}

export interface IUser extends IUserInfo {
	// Add more required data in the future
	password: string;
}
