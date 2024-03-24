import { RequestHandler } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import { attachTokenToCookie, issueToken } from "../../helpers/token_helper";

const signupController: RequestHandler<{}, {}, ISignup> = async (req, res) => {
	const { email, password, username } = req.body;
	const saltRounds = 10;

	try {
		// Store user with hashed password and return an access token with user data without password
		await bcrypt.hash(password, saltRounds).then(async function (hash) {
			const createUser = await User.create({ email, password: hash, username });
			if (createUser) {
				// destructure user data
				// to get everything except password
				const { password, ...rest } = createUser.toObject();
				const accessToken = issueToken({ _id: rest._id.toString() });

				// Attach token inside the cookie
				attachTokenToCookie(accessToken, res);

				return res.status(201).json(rest);
			}
		});
	} catch (error: any) {
		if (error.code === 11000) {
			// get the first error key
			const getKey = Object.keys(error.keyValue)[0];

			return res.status(400).json({
				message: `${getKey}: \'${error.keyValue[getKey]}\' already in use`,
			});
		} else return res.status(500).json({ message: "Internal Server Error" });
	}
};

export default signupController;
