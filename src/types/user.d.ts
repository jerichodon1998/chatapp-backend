interface IUserInfo {
	username: string;
	email: string;
}

interface ISignin {
	email: string;
	password: string;
}

interface ISignup extends IUserInfo {
	password: string;
}

interface IUser extends IUserInfo {
	// Add more required data in the future
	password: string;
}
