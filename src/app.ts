import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

export const app: FastifyInstance = fastify({
  logger: true,
});

const prisma = new PrismaClient();

prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@prisma.io",
  },
});
