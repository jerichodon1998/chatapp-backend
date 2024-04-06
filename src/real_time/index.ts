import { Server } from "socket.io";
import { Server as httpServer } from "http";

const initializeSocketServer = (server: httpServer) => {
	const io = new Server(server, {
		// TODO - setup cors and other options later
	});

	return io;
};

export default initializeSocketServer;
