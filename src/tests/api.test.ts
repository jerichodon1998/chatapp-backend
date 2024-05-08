import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../rest_api";
import DBConnection from "../database_configurations/DBConnection";

interface IAllResponses {
	signin: null | any;
	channel: null | any;
	message: null | any;
}

describe("api test", () => {
	const PORT = 1234;
	const expressAPI = app.listen(PORT);
	let requestInstance = request(expressAPI);
	let cookie: undefined | string;

	const allResponses: IAllResponses = {
		signin: null,
		channel: null,
		message: null,
	};

	beforeAll(async () => {
		await DBConnection.dbConnect();
	});

	test("Signin with email and password", async () => {
		const response = await requestInstance.post("/auth/signin").send({
			email: "mark@email.com",
			password: "password",
		});
		expect(response.headers["set-cookie"]).not.toBeUndefined();
		cookie = response.headers["set-cookie"][0];
		allResponses.signin = response.body;
	});

	test("Should access the protected route", async () => {
		expect(cookie).not.toBeNull();
		if (cookie) {
			return requestInstance
				.get("/protected")
				.set("Cookie", cookie)
				.expect(200);
		}
	});

	test("Should send a message", async () => {
		const message = {
			content: `${allResponses.signin.email}'s message`,
			authorId: allResponses.signin._id,
			recipientId: "66050fb3b2eb78151b731142",
			channelType: "direct",
		};
		expect(cookie).not.toBeNull();
		if (cookie) {
			const response = await requestInstance
				.post("/messages")
				.set("Cookie", cookie)
				.send(message)
				.expect(201);
			allResponses.message = response.body;
		}
	});

	test("Get user subscribed channel", async () => {
		expect(cookie).not.toBeNull();
		if (cookie) {
			const response = await requestInstance
				.get(`/channels/${allResponses.signin.channels[0]}`)
				.set("Cookie", cookie)
				.expect(200);

			allResponses.channel = response.body;
		}
	});

	test("Delete a channel", async () => {
		expect(cookie).not.toBeNull();
		if (cookie) {
			const response = await requestInstance
				.del(`/channels/${allResponses.signin.channels[0]}`)
				.set("Cookie", cookie)
				.expect(200);
			allResponses.channel = response.body;
		}
	});

	afterAll(async () => {
		console.log(allResponses);
		expressAPI.close();
		await DBConnection.dbDisconnect();
	});
});
