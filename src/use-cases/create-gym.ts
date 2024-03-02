import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface CreateGymUseCaseRequest {
  id: string;
  title: string;
  description?: string | null;
  photo?: string | null;
  latitude: number;
  longitude: number;
}
interface CreateGymUseCaseResponse {
  gym: Gym;
}
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    photo,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      photo,
      latitude,
      longitude,
    });
    return { gym };
  }
}
