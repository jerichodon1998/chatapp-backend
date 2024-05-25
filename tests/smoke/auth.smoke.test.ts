import { afterAll, describe, expect, test } from "@jest/globals";
import DBConnection from "../../src/database_configurations/DBConnection";
import restAPI from "../../src/rest_api";
import { Server } from "http";
import { ISignin, ISignup } from "UserTypes";
import request from "supertest";

describe("Authentication tests:", () => {
	const PORT = 3001;
	const signinEndPoint = "/auth/signin";
	const signupEndpoint = "/auth/signup";
	const usersEndpoint = "/users";
	const userCredentials: ISignin & ISignup = {
		email: "testuser@email.com",
		username: "testusername",
		password: "password",
		channels: [],
	};
	let api: null | Server = null;

	beforeAll(async () => {
		try {
			await DBConnection.dbConnect();
			api = restAPI.listen(PORT);
		} catch (error) {
			console.error(
				"Failed to connect to the database or initialize API:",
				error
			);
			throw error;
		}
	});

	test("Should signup successfully with right input credentials", async () => {
		if (!api) {
			throw new Error("API is null");
		}

		const response = await request(api)
			.post(signupEndpoint)
			.send(userCredentials);

		expect(response.statusCode).toBe(201);
	});

	test("Should login successfully with right credentials", async () => {
		if (!api) {
			throw new Error("API is null");
		}

		const response = await request(api)
			.post(signinEndPoint)
			.send(userCredentials);

		const tokenKeyValuePair = response.headers["set-cookie"][0]
			.split(";")[0]
			.split("=");
		const tokenKey = tokenKeyValuePair[0];
		const tokenValue = tokenKeyValuePair[1];

		expect(response.statusCode).toBe(200);
		expect(tokenKey).toBe("Bearer");
		expect(tokenValue).not.toBeFalsy();
	});

	test("Should delete user account", async () => {
		if (!api) {
			throw new Error("API is null");
		}

		// login and use the token to request a delete a user
		const response = await request(api)
			.post(signinEndPoint)
			.send(userCredentials);

		const tokenKeyValuePair = response.headers["set-cookie"][0].split(";")[0];

		const deleteUserResponse = await request(api)
			.delete(`${usersEndpoint}/${response.body._id}`)
			.set("Cookie", tokenKeyValuePair);

		expect(deleteUserResponse.statusCode).toBe(200);
	});

	afterAll(async () => {
		await DBConnection.dbDisconnect();
		api?.close();
	});
});
