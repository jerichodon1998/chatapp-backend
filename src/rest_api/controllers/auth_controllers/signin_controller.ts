import { RequestHandler } from "express";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import { attachTokenToCookie, issueToken } from "../../../helpers/token_helper";
import { ISignin } from "../../../types/user";

const signinController: RequestHandler<{}, {}, ISignin> = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Input all required fields" });
	}

	try {
		const foundUser = await User.findOne({ email: email });
		if (!foundUser)
			return res.status(400).json({ message: "Invalid credentials" });

		// if match, compare user hash password and if match return user data with token without password
		await bcrypt.compare(password, foundUser.password).then(function (result) {
			if (result) {
				// destructure user data
				// to get everything except password
				const { password, ...rest } = foundUser.toObject();
				const accessToken = issueToken({ _id: rest._id.toString() });

				// Attach token inside the cookie
				attachTokenToCookie(accessToken, res);

				return res.status(200).json(rest);
			}
			// if not, return error
			else {
				return res.status(400).json({ message: "Invalid credentials" });
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export default signinController;
