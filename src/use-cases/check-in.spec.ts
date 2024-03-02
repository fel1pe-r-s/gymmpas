import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-in-error";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Prisma } from "@prisma/client";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Jhon",
      description: "test description",
      photo: "",
      latitude: new Prisma.Decimal(-12.2717725),
      longitude: new Prisma.Decimal(-38.9909238),
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -12.2717725,
      userLongitude: -38.9909238,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to Check in twice in same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -12.2717725,
      userLongitude: -38.9909238,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -12.2717725,
        userLongitude: -38.9909238,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should not be able to Check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -12.2717725,
      userLongitude: -38.9909238,
    });
    vi.setSystemTime(new Date(2022, 0, 15, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -12.2717725,
      userLongitude: -38.9909238,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Jhon",
      description: "test description",
      photo: "",
      latitude: new Prisma.Decimal(-12.2633015),
      longitude: new Prisma.Decimal(-38.9819116),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -12.2717725,
        userLongitude: -40.9909238,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
