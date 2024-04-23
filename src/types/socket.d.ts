import { Namespace, Socket } from "socket.io";
import { Server as httpServer } from "http";

export type ICallbackResponse = (response: {
	status: number;
	message: string;
}) => void;

export type NamespaceNames = "channels" | "messages";

export interface ICustomNamespace {
	name: NamespaceNames;
	namespace: Namespace | undefined;
	socket: Socket | undefined;

	initializeNamespace: (io: Server) => void;
	joinRooms: () => Promise<void>;
	joinRoom: (channelId: string) => Promise<void>;
	socketEvents: () => void;
	serverSentEvents: () => Promise<void>;
	getNamespace: () => Namespace;
}

export interface ISocketServer {
	io: Server | undefined;
	initializeServer: (server: httpServer) => void;
	getServer: () => void;
	initializeNamespaces: () => void;
}
