import { Server, ServerOptions } from "socket.io";
import { Server as httpServer } from "http";

let io: null | Server = null;

// initialize socketio server
export const initializeSocketServer = (
	server: httpServer,
	options?: ServerOptions
) => {
	io = new Server(server, options);
};

// get socketio server
export const getIOServer = () => {
	if (!io) {
		throw new Error(
			"Initialize socket server - invoke 'initializeSocketServer()'"
		);
	}

	return io;
};
