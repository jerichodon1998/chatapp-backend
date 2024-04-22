import express, { Request, Response } from "express";
``;
import morgan from "morgan";
import cookieParser from "cookie-parser";

import auth_routes from "../rest_api/routes/auth_routes";
import channel_routes from "../rest_api/routes/channel_routes";
import message_routes from "../rest_api/routes/message_routes";
import { verifyToken } from "../rest_api/middlewares/token_middlewares/jwt_token_middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// test get route
app.get("/", async (req: Request, res: Response) => {
	return res.json("Test");
});

// test protected get route
app.get("/protected", verifyToken, async (req: Request, res: Response) => {
	return res.json("Test protected route");
});

// authentication path
app.use("/auth", auth_routes);
// message path
app.use("/messages", message_routes);
// channel path
app.use("/channels", channel_routes);

export default app;
