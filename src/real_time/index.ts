import { Server } from "socket.io";
import { Server as httpServer } from "http";
class SocketServer {
	io?: Server;

	initializeServer(server: httpServer) {
		this.io = new Server(server);
	}

	// TODO - initialize namespaces
}
const socketServer = new SocketServer();

export default socketServer;
