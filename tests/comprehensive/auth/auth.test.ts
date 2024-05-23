import { afterAll, describe, test } from "@jest/globals";
import DBConnection from "../../../src/database_configurations/DBConnection";
import restAPI from "../../../src/rest_api";
import { Server } from "http";
import { ISignin, ISignup } from "UserTypes";
import request from "supertest";

describe("Authentication tests:", () => {
	const PORT = 1234;
	const signinEndPoint = "/auth/signin";
	const userSigninCredentials: ISignin = {
		email: "mark@email.com",
		password: "password",
	};

	const userSignupCredentials: ISignup = {
		...userSigninCredentials,
		username: "testusername",
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

	// TODO - Implement this after creating a delete user route and controller
	test.todo("Should signup successfully with right input credentials");

	test("Should login successfully with right credentials", async () => {
		if (!api) {
			throw new Error("API is null");
		}

		const response = await request(api)
			.post(signinEndPoint)
			.send(userSignupCredentials);

		const tokenKeyValuePair = response.headers["set-cookie"][0]
			.split(";")[0]
			.split("=");
		const tokenKey = tokenKeyValuePair[0];
		const tokenValue = tokenKeyValuePair[1];

		expect(response.statusCode).toBe(200);
		expect(tokenKey).toBe("Bearer");
		expect(tokenValue).not.toBeFalsy();
	});

	// TODO - Implement this after creating a delete user route and controller
	test.todo("Should delete user account");

	afterAll(async () => {
		await DBConnection.dbDisconnect();
		api?.close();
	});
});
