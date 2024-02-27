import fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./router/users";

export const app: FastifyInstance = fastify({
  logger: true,
});

app.register(userRoutes, { prefix: "users" });
