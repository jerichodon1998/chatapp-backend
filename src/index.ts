import "dotenv/config";
import { createServer } from "http";
import DBConnection from "./database_configurations/DBConnection";
import app from "./rest_api";
import socketServer from "./real_time";

const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;

// initialize connection to database
DBConnection.dbConnect();

// create httpServer with createServer and express app
const httpServer = createServer(app);
// initialize socketio
socketServer.initializeServer(httpServer);
// get io instance
const io = socketServer.getServer();
// test socket
io.on("connection", (socket) => {
	console.log("connected: ", socket.id);
	socket.on("message", (msg, callback) => {
		console.log("main namespace:", msg);
		callback({ status: 200, message: "Message sent" });
		socket.emit("message", msg);
	});
});

httpServer.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
