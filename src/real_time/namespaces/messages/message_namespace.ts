import { Namespace, Server } from "socket.io";
import { messageHandler } from "../../handlers/message_handlers";

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

			socket.on("message:send", messageHandler);
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
