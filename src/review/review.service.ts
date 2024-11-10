// review.service.ts
import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async addReview(userId: number, productId: number, rating: number, comment?: string) {
    const orderExists = await this.prisma.order.findFirst({
      where: {
        userId: userId,
        orderItems: {
          some: {
            productId: productId,
          },
        },
        status: OrderStatus["COMPLETED"], // Check if the order is completed
      },
    });

    if (!orderExists) {
      throw new ForbiddenException("You can only review products you have purchased.");
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });
  }
}
