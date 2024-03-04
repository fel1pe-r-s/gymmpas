import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { randomUUID } from "crypto";
import { SearchGymsUseCase } from "./search-gyms";

let gymRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymRepository);
  });
  it("should be able to search gyms", async () => {
    await gymRepository.create({
      title: "Gym John",
      description: null,
      photo: null,
      latitude: -12.2717725,
      longitude: -38.9909238,
    });

    await gymRepository.create({
      title: "Gym typically",
      description: null,
      photo: null,
      latitude: -12.2717725,
      longitude: -38.9909238,
    });

    const { gyms } = await sut.execute({
      query: "typically",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym typically" })]);
  });

  it("'should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `Gym typically ${i}`,
        description: null,
        photo: null,
        latitude: -12.2717725,
        longitude: -38.9909238,
      });
    }

    const { gyms } = await sut.execute({
      query: "typically",
      page: 2,
    });
    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym typically 21" }),
      expect.objectContaining({ title: "Gym typically 22" }),
    ]);
  });
});
