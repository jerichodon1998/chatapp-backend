import { messageSendHandler } from "../../handlers/message_handlers/message_send_handler";
import { messageDeleteHandler } from "../../handlers/message_handlers/message_delete_handler";
import { messageUpdateHandler } from "../../handlers/message_handlers/message_update_handler";
import messageMiddlewares from "../../middlewares/message_middlewares";
import Message from "../../../models/Message";
import { mongo } from "mongoose";
import CustomNamespace from "../../socket_models/CustomNamespace";
import { NamespaceNames } from "../../../types/socket";

// TODO - validation/sanitization of user inputs
class MessageManager extends CustomNamespace {
	constructor(name: NamespaceNames) {
		super(name);
	}

	socketEvents() {
		if (!this.namespace) {
			throw new Error("Need to initialize namespace first");
		}

		// namespace test
		this.namespace.on("connection", async (socket) => {
			console.log(`${this.name} namespace connected`, socket.id);
			// connection socket
			this.socket = socket;

			// invoke join rooms
			await this.joinRooms();

			// middleware
			this.socket.use(([event, ...args], next) => {
				messageMiddlewares(event, args, next, socket);
			});
			// TODO - send message should be able to distinguish
			// 		- direct(private messages) channels with unique combinations of members

			socket.on("message:send", messageSendHandler);
			socket.on("message:delete", messageDeleteHandler);
			socket.on("message:update", messageUpdateHandler);
		});
	}

	async serverSentEvents() {
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
				if (!this.namespace) {
					throw new Error("Need to initialize namespace first");
				}

				// Emit message on every Message ChangeStream event [insert, update, delete]
				switch (data.operationType) {
					case "insert":
						this.namespace
							.to(data.fullDocument.channelId.toString())
							.emit("message:send", data);
						break;
					case "update":
						this.namespace
							.to(data.fullDocument?.channelId.toString())
							.emit("message:update", data);
						break;
					case "delete":
						this.namespace
							.to(data.fullDocumentBeforeChange?.channelId.toString())
							.emit("message:delete", data);
						break;
				}
			}
		);
	}
	getNamespace() {
		if (!this.namespace) {
			throw new Error("Need to initialize namespace first");
		}

		return this.namespace;
	}
}

const namespace = new MessageManager("messages");

export default namespace;
