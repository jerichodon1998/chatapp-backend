import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.get("/", (req: Request, res: Response) => {
	return res.status(200).json("Test");
});

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
