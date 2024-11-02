import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus } from "@prisma/client"; // Adjust import if enums are defined elsewhere

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Function to get order status by order ID
  async getOrderStatus(orderId: number): Promise<OrderStatus> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order.status;
  }

  // Function to update order status
  //   async updateOrderStatus(orderId: number, newStatus: string): Promise<string> {
//     const order = await this.prisma.order.findUnique({ where: { id: orderId } });

//     if (!order) {
//       throw new NotFoundException(`Order with ID ${orderId} not found`);
//     }

//     await this.prisma.order.update({
//       where: { id: orderId },
//       data: { status: newStatus },
//     });

//     return `Order status updated to ${newStatus}`;
  //   }
}
