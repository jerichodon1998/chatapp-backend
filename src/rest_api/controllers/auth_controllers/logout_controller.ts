import { RequestHandler } from "express";

// This would just return an empty Bearer cookie
// TODO - apply some token revoke of some sort in the future. Suggestion Tech/Framework - Redis
const logoutController: RequestHandler = (req, res) => {
	res.cookie("Bearer", "");
	return res.status(200).json({ message: "Logged out successfully" });
};

export default logoutController;
