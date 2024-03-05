import { FastifyInstance } from "fastify";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifYUserRole } from "@/http/middlewares/verify-user-role";

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJWT);
  app.post("/gyms", { onRequest: [verifYUserRole("ADMIN")] }, create);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
};
