import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { randomUUID } from "crypto";

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      id: randomUUID(),
      title: "Gym John",
      description: null,
      photo: null,
      latitude: -12.2717725,
      longitude: -38.9909238,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
