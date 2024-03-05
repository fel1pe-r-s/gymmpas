import fastify, { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";
import { userRoutes } from "./http/controllers/users/router";
import { gymsRoutes } from "./http/controllers/gyms/router";
import { checkInsRoutes } from "./http/controllers/check-ins/router";
import fastifyCookie from "@fastify/cookie";

export const app: FastifyInstance = fastify({
  logger: true,
});
app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});
app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);
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
