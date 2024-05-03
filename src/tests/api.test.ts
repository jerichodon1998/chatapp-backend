import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../rest_api";

describe("api test", () => {
	const PORT = 1234;
	const expressAPI = app.listen(PORT);

	test("It should responed 200 status code", async () => {
		return request(expressAPI).get("/").expect(200);
	});

	afterAll(async () => {
		expressAPI.close();
	});
});
