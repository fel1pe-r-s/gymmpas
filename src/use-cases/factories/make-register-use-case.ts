import { UsersPrismaRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const usersRepository = new UsersPrismaRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}
