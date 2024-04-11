import { Server } from "socket.io";
import { Server as httpServer } from "http";
import messageNamespace from "./namespaces/messages/message_namespace";
import { serialize } from "cookie";
class SocketServer {
	#io?: Server;

	initializeServer(server: httpServer) {
		this.#io = new Server(server, {
			cors: {
				origin: "http://localhost:3000",
				credentials: true,
			},
		});

		// TODO - rewrite/fix when starting/while implementing auth with frontend
		// NOTE - The token will be used should be the one from signin/signup token
		// 			 from the express server http cookie
		this.#io.engine.on("initial_headers", (headers, request) => {
			console.log("Handshake done");
			headers["set-cookie"] = serialize("Bearer", "myAccessToken", {
				sameSite: "none",
				httpOnly: true,
				secure: true,
				path: "/",
				maxAge: 60 * 60,
			});
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
