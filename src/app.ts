import fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./http/router/users";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";

export const app: FastifyInstance = fastify({
  logger: true,
});
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(userRoutes);
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "validation error", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: here we should log to on external tool like dataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "internal server error" });
});
