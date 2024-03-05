import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Register", () => {
  beforeEach(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Jhon Doe",
      email: "jhon.doe@gmail.com",
      password: "password",
    });

    expect(response.statusCode).toEqual(201);
  });
});
