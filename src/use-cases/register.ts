import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

type userProps = { name: string; email: string; password: string };

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: userProps) {
    const password_hash = await hash(password, 10);
    const userWithEmail = await this.usersRepository.findByEmail(email);
    if (userWithEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({ name, email, password_hash });
  }
}
