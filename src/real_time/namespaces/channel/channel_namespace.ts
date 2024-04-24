import { verifyJwtToken } from "../../../helpers/token_helper";
import Channel from "../../../models/Channel";
import { ObjectId } from "mongodb";
import { mongo } from "mongoose";
import CustomNamespace from "../../socket_models/CustomNamespace";
import { TNamespaceNames } from "../../../types/socket";

class ChannelManager extends CustomNamespace<"channels"> {
	constructor(name: TNamespaceNames) {
		super(name);
	}

	// override
	socketEvents() {
		if (!this.namespace) {
			throw new Error("Need to initialize namespace first");
		}

		// namespace connection
		this.namespace.on("connection", async (socket) => {
			console.log(`${this.name} namespace connected`, socket.id);
			// connection socket
			this.socket = socket;

			// invoke join rooms
			await this.joinRooms();

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
			this.socket.on("disconnection", async () => {
				const joinedRooms = socket.rooms;

				for (const room of joinedRooms) {
					await this.socket?.leave(room);
				}
			});
		});
	}

	async serverSentEvents() {
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
				if (!this.namespace) {
					throw new Error("Need to initialize namespace first");
				}

				// exit if there are no connected socket(s)
				if (!this.socket?.id) {
					console.log(`No socket connected on ${this.name}`);
					return;
				}

				// Emit channel on every Channel ChangeStream event [insert, update, delete]
				switch (data.operationType) {
					case "insert":
						// check if user is a member of the channel
						const decoded = verifyJwtToken(this.socket);
						const channel = await Channel.findOne({
							_id: data.fullDocument._id.toString(),
							members: { $in: [new ObjectId(decoded._id)] },
						});
						if (channel) {
							// join new created/inserted room
							await this.joinRoom(data.fullDocument._id.toString());
							this.namespace
								.to(data.fullDocument._id.toString())
								.emit("channelCreate", data, (response) => {
									response.forEach((res) => console.log(res.status));
								});
						}
						break;
					case "update":
						this.namespace
							.to(data.fullDocument?._id.toString())
							.emit("channelUpdate", data, (response) => {
								response.forEach((res) => console.log(res.status));
							});
						break;
					case "delete":
						// emit delete data
						this.namespace
							.to(data.fullDocumentBeforeChange?._id.toString())
							.emit("channelDelete", data, (response) => {
								response.forEach((res) => console.log(res.status));
							});
						// leave room(channel)
						await this.socket.leave(
							data.fullDocumentBeforeChange?._id.toString()
						);
						break;
				}
			}
		);
	}
}

const channelNamespace = new ChannelManager("channels");

export default channelNamespace;
