import { FastifyInstance } from "fastify";
import { register } from "@/controllers/register";

export const userRoutes = async (app: FastifyInstance) => {
  app.post("/", register);
};
