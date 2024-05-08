import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { IToken } from "TokenTypes";

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

export const verifyJwtToken = (
	req: Request<any> | Socket
): JwtPayload & IToken => {
	let bearer = null;
	if (req instanceof Socket) {
		bearer = req.handshake.headers.cookie?.split("=")[1];
	} else {
		bearer = req.cookies["Bearer"];
	}
	try {
		const decoded = jwt.verify(bearer, JWT_KEY) as IToken & JwtPayload;
		return decoded;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
