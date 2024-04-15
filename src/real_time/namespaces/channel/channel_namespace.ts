import { Namespace, Server, Socket } from "socket.io";
import { verifyJwtToken } from "../../../helpers/token_helper";
import Channel from "../../../models/Channel";
import { ObjectId } from "mongodb";
import { mongo } from "mongoose";

class CustomNamespace {
	#channelNamespace?: Namespace;
	#socket?: Socket;

	initializeNamespace(io: Server) {
		// create a custom namespace
		this.#channelNamespace = io.of("/channels");

		this.#registerEvents();
		this.#serverSentEvents();
	}

	// TODO - improve join rooms
	// NOTE - Can improve this by creating a list of the user's joined channels
	async #joinRooms() {
		if (!this.#socket?.id) {
			throw new Error("Need to initialize namespace first");
		}

		try {
			// verify token
			const decodedToken = verifyJwtToken(this.#socket);
			// fetch channels where the user is a member through the _id payload from token
			const channels = await Channel.find({
				members: {
					$in: new ObjectId(decodedToken._id),
				},
			});
			// join rooms
			for (let i = 0; i < channels.length; i++) {
				await this.#socket.join(channels[i]._id.toString());
			}
		} catch (error) {
			console.log(error);
		}
	}

	// join to a single room
	// this is used after a channel creating/insert
	async #joinRoom(channelId: string) {
		if (!this.#socket?.id) {
			throw new Error("Need to initialize namespace first");
		}

		await this.#socket.join(channelId);
	}

	#registerEvents() {
		if (!this.#channelNamespace) {
			throw new Error("Need to initialize namespace first");
		}

		// namespace connection
		this.#channelNamespace.on("connection", async (socket) => {
			console.log("channel namespace connected", socket.id);
			// connection socket
			this.#socket = socket;

			// invoke join rooms
			await this.#joinRooms();

			// NOTE - 'direct' channelType messages auto creates channel (checkout message:send handler)
			// TODO - Implement create channel (typically used for groups because direct has auto-create channel)
			// TODO - Implement update channel

			// middleware
			// TODO - middleware here

			// NOTE - channel events' listener
			// NOTE - channel delete route exists in rest_api/channel, read more
			// 			if you need to implement socketio event & handlers or is the express api enough.
			// 			Same thing goes to update and create.

			// Leave all rooms on disconnection
			this.#socket.on("disconnection", async () => {
				const joinedRooms = socket.rooms;

				for (const room of joinedRooms) {
					await this.#socket?.leave(room);
				}
			});
		});
	}

	async #serverSentEvents() {
		Channel.watch([], {
			// Set fullDocument to "updateLookup" to direct watch() to look up the most current
			// majority-committed version of the updated document.
			fullDocument: "updateLookup",
			// "required" to output the document pre-image before the document was replaced,
			// updated, or deleted. Raises an error if the pre-image is not available.
			fullDocumentBeforeChange: "required",
		}).on(
			"change",
			async (
				data:
					| mongo.ChangeStreamDocument
					| mongo.ChangeStreamInsertDocument
					| mongo.ChangeStreamUpdateDocument
					| mongo.ChangeStreamReplaceDocument
					| mongo.ChangeStreamDeleteDocument
					| mongo.ChangeStreamDropDocument
					| mongo.ChangeStreamRenameDocument
					| mongo.ChangeStreamDropDatabaseDocument
					| mongo.ChangeStreamInvalidateDocument
					| mongo.ChangeStreamCreateIndexDocument
					| mongo.ChangeStreamCreateDocument
					| mongo.ChangeStreamCollModDocument
					| mongo.ChangeStreamDropIndexDocument
					| mongo.ChangeStreamShardCollectionDocument
					| mongo.ChangeStreamReshardCollectionDocument
					| mongo.ChangeStreamRefineCollectionShardKeyDocument
			) => {
				if (!this.#channelNamespace) {
					throw new Error("Need to initialize namespace first");
				}

				if (!this.#socket?.id) {
					throw new Error("Need to initialize namespace first");
				}

				// Emit channel on every Channel ChangeStream event [insert, update, delete]
				switch (data.operationType) {
					case "insert":
						// check if user is a member of the channel
						const decoded = verifyJwtToken(this.#socket);
						const channel = await Channel.findOne({
							_id: data.fullDocument._id.toString(),
							members: { $in: [new ObjectId(decoded._id)] },
						});
						if (channel) {
							// join new created/inserted room
							await this.#joinRoom(data.fullDocument._id.toString());
							this.#channelNamespace
								.to(data.fullDocument._id.toString())
								.emit("channel:create", data);
						}
						break;
					case "update":
						this.#channelNamespace
							.to(data.fullDocument?._id.toString())
							.emit("channel:update", data);
						break;
					case "delete":
						// leave room(channel)
						await this.#socket.leave(
							data.fullDocumentBeforeChange?._id.toString()
						);
						// emit delete data
						this.#channelNamespace
							.to(data.fullDocumentBeforeChange?._id.toString())
							.emit("channel:delete", data);
						break;
				}
			}
		);
	}
	getNamespace() {
		if (!this.#channelNamespace) {
			throw new Error("Need to initialize namespace first");
		}

		return this.#channelNamespace;
	}
}

const channelNamespace = new CustomNamespace();

export default channelNamespace;
