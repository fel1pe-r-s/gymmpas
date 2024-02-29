import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { ImMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register use case", () => {
  it("should hash user password upon registration", async () => {
    const UsersRepository = new ImMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(UsersRepository);

    const { user } = await registerUserCase.execute({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const UsersRepository = new ImMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(UsersRepository);
    const email = "jhondoe@gmail.com";
    await registerUserCase.execute({
      name: "Jhon Doe",
      email,
      password: "123456",
    });

    expect(
      async () =>
        await registerUserCase.execute({
          name: "Jhon Doe",
          email,
          password: "123456",
        })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should be able to register", async () => {
    const UsersRepository = new ImMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(UsersRepository);
    const email = "jhondoe@gmail.com";
    const { user } = await registerUserCase.execute({
      name: "Jhon Doe",
      email,
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
