import { Server } from "socket.io";
import { Server as httpServer } from "http";
class SocketServer {
	#io?: Server;

	initializeServer(server: httpServer) {
		this.#io = new Server(server);
	}

	getServer() {
		// throws an error if server not initialized
		if (!this.#io) {
			throw new Error("Need to initializeServer SocketServer");
		}
		return this.#io;
	}

	// TODO - initialize namespaces
}
const socketServer = new SocketServer();

export default socketServer;
