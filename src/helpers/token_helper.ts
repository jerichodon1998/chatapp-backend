import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_KEY =
	process.env.ENV === "production" ? process.env.JWT_KEY : "secretkey";

export const issueToken = (tokenPayload: IToken): string =>
	jwt.sign(tokenPayload, JWT_KEY, { expiresIn: "1h" });

export const attachTokenToCookie = (accessToken: string, res: Response) => {
	res.cookie("Bearer", accessToken, {
		secure: true,
		httpOnly: true,
		sameSite: "none",
		maxAge: 60 * 60 * 1000, // 1hr
	});
};

export const decodeToken = (req: Request): JwtPayload & IToken => {
	const { Bearer } = req.cookies;
	try {
		const decoded = jwt.verify(Bearer, JWT_KEY) as IToken & JwtPayload;
		return decoded;
	} catch (error) {
		throw new Error("Invalid Token");
	}
};
