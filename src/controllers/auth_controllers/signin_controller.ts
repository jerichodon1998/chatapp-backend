import { RequestHandler } from "express";
import User from "../../models/User";

const signinController: RequestHandler<{}, {}, ISignin> = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Input all required fields" });
	}

	try {
		const foundUser = await User.findOne({ email: email });
		if (!foundUser)
			return res.status(400).json({ message: "Invalid credentials" });

		// if match, return user data without password
		// TODO - compare to hashed password and return an access token
		if (foundUser.password === password) {
			const { password, ...rest } = foundUser.toObject();
			return res.status(200).json(rest);
		}
		// if not, return error
		else {
			return res.status(400).json({ message: "Invalid credentials" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export default signinController;
