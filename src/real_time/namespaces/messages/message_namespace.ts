import { Namespace, Server } from "socket.io";
import { messageSendHandler } from "../../handlers/message_handlers/message_send_handler";

// TODO - apply auth
// TODO - validation/sanitization of user inputs
class CustomNamespace {
	#messageNamespace?: Namespace;

	initializeNamespace(io: Server) {
		// create a custom namespace
		this.#messageNamespace = io.of("/messages");
		// invoke onConn to test if working
		this.#registerEvents();
	}

	#registerEvents() {
		if (!this.#messageNamespace) {
			throw new Error("Need to initialize namespace first");
		}

		// namespace test
		this.#messageNamespace.on("connection", (socket) => {
			console.log("namespace connected", socket.id);
			// TODO - send message should be able to distinguish
			// 		- direct(private messages) channels with unique combinations of members

			// NOTE - mongodb indexes doesn't have a unique permutation on array elements
			// SUGGESTION - add a field on Channels Schema where the two IDs of the direct channelType
			// 				- be concatenated as a string with '-' e.g. userId1-userId2
			// 				- and use it to create unique index
			socket.on("message:send", messageSendHandler);
		});
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
