import { PrismaRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}
