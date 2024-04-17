import { Namespace, Socket } from "socket.io";
import { Server as httpServer } from "http";

export type ICallbackResponse = (response: {
	status: number;
	message: string;
}) => void;

export interface ICustomNamespace {
	name: string;
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
