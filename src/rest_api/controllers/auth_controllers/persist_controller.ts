import { RequestHandler } from "express";
import { verifyJwtToken } from "../../../helpers/token_helper";
import User from "../../../models/User";

const persistController: RequestHandler = async (req, res) => {
	try {
		const decodedToken = verifyJwtToken(req);
		const user = await User.findById(decodedToken._id);

		if (user) {
			const { password, ...rest } = user.toJSON();
			console.log(rest);
			return res.status(200).json(rest);
		} else {
			return res.status(404).json({ message: "Not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export default persistController;
