import { RequestHandler } from "express";
import User from "../../../models/User";
import { IDeleteAccountRequestParams } from "UserTypes";

const deleteAccountController: RequestHandler<
	IDeleteAccountRequestParams
> = async (req, res) => {
	const { uid } = req.params;

	try {
		await User.findByIdAndDelete(uid);
		return res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Something went wrong, try again later" });
	}
};

export default deleteAccountController;
