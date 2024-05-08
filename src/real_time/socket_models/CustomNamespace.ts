import { Server, Socket } from "socket.io";
import { verifyJwtToken } from "../../helpers/token_helper";
import {
	ICustomNamespace,
	TNamespaceNames,
	TypeOfNamespace,
} from "../../types/socket";
import User from "../../models/User";

export default class CustomNamespace<T extends TNamespaceNames>
	implements ICustomNamespace
{
	name: TNamespaceNames;
	namespace: TypeOfNamespace<T> | undefined;
	socket: Socket | undefined;

	constructor(name: TNamespaceNames) {
		this.name = name;
	}

	initializeNamespace(io: Server) {
		// create a custom namespace
		this.namespace = io.of(`/${this.name}`) as TypeOfNamespace<T>;

		this.socketEvents();
		this.serverSentEvents();
	}

	// join rooms with user's channels property
	async joinRooms() {
		if (!this.socket?.id) {
			throw new Error("Need to initialize namespace first");
		}

		try {
			// verify token
			const decodedToken = verifyJwtToken(this.socket);
			// fetch channels where the user is a member through the _id payload from token
			const user = await User.findById(decodedToken._id, { channels: 1 });
			// return error if user doesn't exist
			if (!user) throw new Error("User not found");

			const channels = user.channels;
			// join rooms
			for (let i = 0; i < channels.length; i++) {
				await this.socket.join(channels[i].toString());
			}
		} catch (error) {
			console.log(error);
		}
	}

	// join to a single room
	// this is used after a channel creating/insert
	async joinRoom(channelId: string) {
		if (!this.socket?.id) {
			throw new Error("Need to initialize namespace first");
		}

		await this.socket.join(channelId);
	}

	socketEvents() {
		if (!this.namespace) {
			throw new Error("Need to initialize namespace first");
		}

		// namespace connection
		this.namespace.on("connection", async (socket) => {
			console.log("channel namespace connected", socket.id);
			// connection socket
			this.socket = socket;

			// invoke join rooms
			await this.joinRooms();

			// Leave all rooms on disconnection
			this.socket.on("disconnection", async () => {
				const joinedRooms = socket.rooms;

				for (const room of joinedRooms) {
					await this.socket?.leave(room);
				}
			});
		});
	}

	async serverSentEvents() {
		throw new Error(`Override ${this.name}' serverSentEvents`);
	}

	getNamespace() {
		if (!this.namespace) {
			throw new Error("Need to initialize namespace first");
		}

		return this.namespace;
	}
}
