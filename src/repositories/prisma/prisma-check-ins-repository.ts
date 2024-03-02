import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDate = dayjs(date).startOf("date");
    const endOfDate = dayjs(date).endOf("date");
    const checkInOnSameDate = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDate.toDate(),
          lte: endOfDate.toDate(),
        },
      },
    });

    if (!checkInOnSameDate) {
      return null;
    }
    return checkInOnSameDate;
  }
}
