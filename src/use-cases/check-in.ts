import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { multipleCheckInSameDayError } from "./errors/multiple-check-in-same-day-error";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInsOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );
    if (checkInsOnSameDay) {
      throw new multipleCheckInSameDayError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
