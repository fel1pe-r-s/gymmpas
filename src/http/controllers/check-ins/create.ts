import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string(),
  });

  const createCheckInsBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });
  const { latitude, longitude } = createCheckInsBodySchema.parse(request.body);
  const { gymId } = createCheckInsParamsSchema.parse(request.params);
  const createCheckInsUseCase = makeCheckInUseCase();
  await createCheckInsUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
