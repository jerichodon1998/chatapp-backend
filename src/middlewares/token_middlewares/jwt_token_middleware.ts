import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const verifyToken: RequestHandler = async (req, res, next) => {
	const { Bearer } = req.cookies;
	const JWT_KEY =
		process.env.ENV === "production" ? process.env.JWT_KEY : "secretkey";
	// verify token
	if (Bearer) {
		try {
			jwt.verify(Bearer, JWT_KEY);

			next();
		} catch (error) {
			console.log(error);
			return res.status(403).json({ message: "Forbidden" });
		}
	} else {
		console.log("No Token");
		return res.status(403).json({ message: "Forbidden" });
	}
};
