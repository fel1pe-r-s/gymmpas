import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymRepository);
  });
  it("should be able to search gyms", async () => {
    await gymRepository.create({
      title: "Gym John",
      description: null,
      photo: null,
      latitude: -12.2717725,
      longitude: -40.9909238,
    });

    await gymRepository.create({
      title: "Gym typically",
      description: null,
      photo: null,
      latitude: -12.2717725,
      longitude: -38.9909238,
    });

    const { gyms } = await sut.execute({
      userLatitude: -12.2717725,
      userLongitude: -38.9909238,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym typically" })]);
  });
});
