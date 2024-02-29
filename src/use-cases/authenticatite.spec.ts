import { expect, describe, it } from "vitest";
import { hash } from "bcryptjs";
import { ImMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate use case", () => {
  it("should be able to authenticate", async () => {
    const UsersRepository = new ImMemoryUsersRepository();
    const sut = new AuthenticateUseCase(UsersRepository);

    await UsersRepository.create({
      name: "John Smith",
      email: "john.smith@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "john.smith@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with a non-existent user", async () => {
    const UsersRepository = new ImMemoryUsersRepository();
    const sut = new AuthenticateUseCase(UsersRepository);

    expect(
      async () =>
        await sut.execute({
          email: "john.smith@gmail.com",
          password: "123456",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate with a wrong password", async () => {
    const UsersRepository = new ImMemoryUsersRepository();
    const sut = new AuthenticateUseCase(UsersRepository);

    await UsersRepository.create({
      name: "John Smith",
      email: "john.smith@gmail.com",
      password_hash: await hash("123456", 6),
    });
    expect(
      async () =>
        await sut.execute({
          email: "john.smith@gmail.com",
          password: "123123",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
