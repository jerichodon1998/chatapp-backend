import { Namespace, Server, Socket } from "socket.io";
import { messageSendHandler } from "../../handlers/message_handlers/message_send_handler";
import { messageDeleteHandler } from "../../handlers/message_handlers/message_delete_handler";
import { messageUpdateHandler } from "../../handlers/message_handlers/message_update_handler";
import messageMiddlewares from "../../middlewares/message_middlewares";
import Message from "../../../models/Message";
import { mongo } from "mongoose";
import { verifyJwtToken } from "../../../helpers/token_helper";
import Channel from "../../../models/Channel";
import { ObjectId } from "mongodb";

// TODO - validation/sanitization of user inputs
class CustomNamespace {
	#messageNamespace?: Namespace;

	initializeNamespace(io: Server) {
		// create a custom namespace
		this.#messageNamespace = io.of("/messages");
		// invoke onConn to test if working
		this.#registerEvents();
		this.#serverSentEvents();
	}

	// TODO - improve join rooms
	// NOTE - Can improve this by creating a list of the user's joined channels
	async #joinRooms(socket: Socket) {
		try {
			const decodedToken = verifyJwtToken(socket);
			const channels = await Channel.find({
				members: {
					$in: new ObjectId(decodedToken._id),
				},
			});

			for (let i = 0; i < channels.length; i++) {
				await socket.join(channels[i]._id.toString());
			}

			console.log("join room(s) done");
		} catch (error) {
			console.log(error);
		}
	}

	#registerEvents() {
		if (!this.#messageNamespace) {
			throw new Error("Need to initialize namespace first");
		}

		// namespace test
		this.#messageNamespace.on("connection", async (socket) => {
			console.log("namespace connected", socket.id);

			// join rooms
			await this.#joinRooms(socket);

			// middleware
			socket.use(([event, ...args], next) => {
				messageMiddlewares(event, args, next, socket);
			});
			// TODO - send message should be able to distinguish
			// 		- direct(private messages) channels with unique combinations of members

			socket.on("message:send", messageSendHandler);
			socket.on("message:delete", messageDeleteHandler);
			socket.on("message:update", messageUpdateHandler);
		});
	}

	async #serverSentEvents() {
		Message.watch([], {
			// Set fullDocument to "updateLookup" to direct watch() to look up the most current
			// majority-committed version of the updated document.
			fullDocument: "updateLookup",
			// "required" to output the document pre-image before the document was replaced,
			// updated, or deleted. Raises an error if the pre-image is not available.
			fullDocumentBeforeChange: "required",
		}).on(
			"change",
			(
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
				if (!this.#messageNamespace) {
					throw new Error("Need to initialize namespace first");
				}

				// Emit message on every Message ChangeStream event [insert, update, delete]
				switch (data.operationType) {
					case "insert":
						this.#messageNamespace
							.to(data.fullDocument.channelId.toString())
							.emit("message:send", data);
						break;
					case "update":
						this.#messageNamespace
							.to(data.fullDocument?.channelId.toString())
							.emit("message:update", data);
						break;
					case "delete":
						this.#messageNamespace
							.to(data.fullDocumentBeforeChange?.channelId.toString())
							.emit("message:delete", data);
						break;
				}
			}
		);
	}
	getNamespace() {
		if (!this.#messageNamespace) {
			throw new Error("Need to initialize namespace first");
		}

		return this.#messageNamespace;
	}
}

const messageNamespace = new CustomNamespace();

export default messageNamespace;
