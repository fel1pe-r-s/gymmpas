import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface FetchUserCaseInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}
interface FetchUserCaseInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCaseInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}
  async execute({
    userId,
    page,
  }: FetchUserCaseInsHistoryUseCaseRequest): Promise<FetchUserCaseInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
