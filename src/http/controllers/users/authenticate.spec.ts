import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("authenticate", () => {
  beforeEach(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "Jhon Doe",
      email: "jhon.doe@gmail.com",
      password: "password",
    });
    const response = await request(app.server).post("/sessions").send({
      email: "jhon.doe@gmail.com",
      password: "password",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
