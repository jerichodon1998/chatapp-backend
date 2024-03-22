import express, { Request, Response } from "express";
import "dotenv/config";
import DBConnection from "./database_configurations/DBConnection";

const app = express();
const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;

DBConnection.dbConnect();

app.get("/", async (req: Request, res: Response) => {
	return res.json("Test");
});

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
