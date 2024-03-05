import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms", () => {
  beforeEach(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym Javascript",
        description: "Some description",
        phone: "1199999999",
        latitude: -12.2717725,
        longitude: -40.9909238,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym TypeScript",
        description: "Some description",
        phone: "1199999999",
        latitude: -12.2717725,
        longitude: -38.9909238,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -12.2717725,
        longitude: -38.9909238,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Gym TypeScript",
      }),
    ]);
  });
});
