import { afterAll, describe } from "@jest/globals";
import DBConnection from "../../../src/database_configurations/DBConnection";
import restAPI from "../../../src/rest_api";
import { Server } from "http";

describe("Authentication tests:", () => {
	const PORT = 1234;

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

	test("Should equal 1 to 1", () => {
		expect(1).toBe(1);
	});

	afterAll(async () => {
		await DBConnection.dbDisconnect();
		api?.close();
	});
});

describe("Signup should throw an error:", () => {
	// email errors
	test.todo("when email is already in use");
	test.todo("when email is not a valid email"); // hint: use regex for validation in your controller
	test.todo("when email is not provided");
	// username errors
	test.todo("when username is already in use"); // hint: apply unique property on the named field "username"
	test.todo("when username is not valid"); // hint: use regex for validation
	test.todo("when username is not provided");
	// password errors
	test.todo("when password is not valid");
	test.todo("when password is not provided");
});
