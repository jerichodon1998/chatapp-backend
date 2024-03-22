import express, { Request, Response } from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;

app.get("/", (req: Request, res: Response) => {
	return res.status(200).json("Test");
});

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
