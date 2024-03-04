import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCaseInsHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeSearchGymsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCaseInsHistoryUseCase(checkInsRepository);
  return useCase;
}
