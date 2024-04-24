import { Namespace, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { mongo } from "mongoose";

export type ICallbackResponse = (response: {
	status: number;
	message: string;
}) => void;

export type TNamespaceNames = "channels" | "messages";

export interface IMessageClientToServerEvents {
	messageSend: (
		payload: ISendMessageSocketPayload,
		callback: ICallbackResponse
	) => Promise<void>;
	messageUpdate: (
		payload: IEditMessageSocketPayload,
		callback: ICallbackResponse
	) => Promise<void>;
	messageDelete: (
		payload: IDeleteMessageSocketPayload,
		callback: ICallbackResponse
	) => Promise<void>;
}

export interface IMessageServerToClientEvents {
	messageSend: (
		data: mongo.ChangeStreamInsertDocument<mongo.BSON.Document>
	) => void;
	messageUpdate: (data: mongo.ChangeStreamUpdateDocument) => void;
	messageDelete: (data: mongo.ChangeStreamDeleteDocument) => void;
}

export interface IChannelServerToClientEvents {
	channelCreate: (
		data: mongo.ChangeStreamInsertDocument<mongo.BSON.Document>
	) => void;
	channelUpdate: (data: mongo.ChangeStreamUpdateDocument) => void;
	channelDelete: (data: mongo.ChangeStreamDeleteDocument) => void;
}

export type TChannelNamespace = Namespace<{}, IChannelServerToClientEvents>;

export type TMessageNamespace = Namespace<
	IMessageClientToServerEvents,
	IMessageServerToClientEvents
>;

export type TypeOfNamespace<T> = T extends "messages"
	? TMessageNamespace
	: T extends "channels"
	? TChannelNamespace
	: never;

export interface ICustomNamespace {
	name: NamespaceNames;
	namespace: TypeOfNamespace | undefined;
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
