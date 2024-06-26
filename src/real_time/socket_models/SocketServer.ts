import { Server } from "socket.io";
import { Server as httpServer } from "http";
import messageNamespace from "../namespaces/messages/message_namespace";
import channelNamespace from "../namespaces/channel/channel_namespace";
import { ISocketServer } from "SocketTypes";

export default class SocketServer implements ISocketServer {
	io: Server | undefined;

	initializeServer(server: httpServer) {
		this.io = new Server(server, {
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
		if (!this.io) {
			throw new Error("Need to initializeServer SocketServer");
		}
		return this.io;
	}

	// initialize namespaces
	initializeNamespaces() {
		const io = this.getServer();

		messageNamespace.initializeNamespace(io);
		channelNamespace.initializeNamespace(io);
	}
}
