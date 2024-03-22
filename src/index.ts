import express, { Request, Response } from "express";
import "dotenv/config";

import DBConnection from "./database_configurations/DBConnection";
import auth_routes from "./routes/auth_routes";

const app = express();
const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;
DBConnection.dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
	return res.json("Test");
});

// authentication path
app.use("/auth", auth_routes);

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
