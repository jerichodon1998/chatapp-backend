import express, { Request, Response } from "express";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import DBConnection from "./database_configurations/DBConnection";
import auth_routes from "./routes/auth_routes";
import { verifyToken } from "./middlewares/token_middlewares/jwt_token_middleware";

const app = express();
const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;
DBConnection.dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", async (req: Request, res: Response) => {
	return res.json("Test");
});

app.get("/protected", verifyToken, async (req: Request, res: Response) => {
	return res.json("Test protected route");
});

// authentication path
app.use("/auth", auth_routes);

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
