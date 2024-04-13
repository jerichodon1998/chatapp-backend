import { Server } from "socket.io";
import { Server as httpServer } from "http";
import messageNamespace from "./namespaces/messages/message_namespace";
class SocketServer {
	#io?: Server;

	initializeServer(server: httpServer) {
		this.#io = new Server(server, {
			cors: {
				origin: "http://localhost:3000",
				credentials: true,
			},
		});

		// invoke initializeNamespaces
		this.initializeNamespaces();
	}

	getServer() {
		// throws an error if server not initialized
		if (!this.#io) {
			throw new Error("Need to initializeServer SocketServer");
		}
		return this.#io;
	}

	// initialize namespaces
	initializeNamespaces() {
		const io = this.getServer();

		messageNamespace.initializeNamespace(io);
	}
}
const socketServer = new SocketServer();

export default socketServer;
