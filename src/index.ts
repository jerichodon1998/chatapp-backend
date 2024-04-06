import "dotenv/config";
import { createServer } from "http";
import DBConnection from "./database_configurations/DBConnection";
import app from "./rest_api";
import initializeSocketServer from "./real_time";

// initialize connection to database
DBConnection.dbConnect();

const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;
const httpServer = createServer(app);

const io = initializeSocketServer(httpServer);

io.on("connection", (socket) => {
	console.log("user connected", socket.id);

	socket.on("message", (msg) => {
		console.log(msg);

		socket.emit("message", msg);
	});
});

httpServer.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
