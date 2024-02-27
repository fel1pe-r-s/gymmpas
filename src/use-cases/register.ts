import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

type userProps = { name: string; email: string; password: string };

export async function registerUseCase({ name, email, password }: userProps) {
  const password_hash = await hash(password, 10);
  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userWithEmail) {
    throw new Error("Email is used");
  }
  await prisma.user.create({
    data: { name, email, password_hash },
  });
}
