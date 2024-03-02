import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { ImMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNoteFoundError } from "./errors/resource-not-found-error";

let UsersRepository: ImMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get profile use case", () => {
  beforeEach(() => {
    UsersRepository = new ImMemoryUsersRepository();
    sut = new GetUserProfileUseCase(UsersRepository);
  });

  it("should be able to get profile", async () => {
    const createUser = await UsersRepository.create({
      name: "John Smith",
      email: "john.smith@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createUser.id,
    });

    expect(user.name).toEqual("John Smith");
  });

  it("Should not be able to get profile with a non-existent-id", async () => {
    expect(
      async () =>
        await sut.execute({
          userId: "non-existent-id",
        })
    ).rejects.toBeInstanceOf(ResourceNoteFoundError);
  });
});
