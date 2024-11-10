import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";
import { AppGateway } from "src/app/app.gateway";
import { MailService } from "src/mail/mail.service";
import { CreateAddressDto } from "./dto/create-address.dto";

@Injectable()
export class OrderService {
  AppGateway: any;
  constructor(
    @Inject(forwardRef(() => AppGateway))
    private readonly appGateway: AppGateway,
    private readonly prisma: PrismaService,
    private readonly emailService: MailService,
  ) {}
  async getOrderStatus(orderId: number, userId: number): Promise<OrderStatus> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId, userId: userId },
        select: { status: true },
      });

      if (!order) {
        throw new NotFoundException(`Order not found`);
      }

      return order.status;
    } catch (error: any) {
      console.log(`The error occured due to: ${error.message}`);
      throw new InternalServerErrorException("Failed to get order status");
    }
  }
  async createAddress(userId: number, createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId: userId,
      },
    });
  }

  async getAddressById(userId: number) {
    const address = await this.prisma.address.findFirst({ where: { userId } });
    if (!address) {
      throw new NotFoundException("Address not found");
    }
    return address;
  }
  async placeOrder(userId: number, addressId: number) {
    try {
      const cartItems = await this.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException("Cart is empty.");
      }
      const addressExist = await this.prisma.address.findFirst({
        where: { userId, id: addressId },
      });
      if (!addressExist) {
        throw new BadRequestException("Address does not exist");
      }
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price * item.quantity,
      }));
      const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);
      if (!addressId) {
        throw new BadRequestException("Invalid address ID");
      }
      const order = await this.prisma.$transaction(async tx => {
        const newOrder = await tx.order.create({
          data: {
            user: {
              connect: { id: userId },
            },
            address: {
              connect: { id: addressId },
            },
            status: "PENDING",
            orderItems: {
              create: orderItems,
            },
          },
          include: { orderItems: true },
        });

        await tx.cartItem.deleteMany({ where: { userId } });

        return newOrder;
      });
      return { order, totalAmount };
    } catch (error: any) {
      console.log(`Place order failed due to ${error.message}`);
      throw new InternalServerErrorException("Failed to place order");
    }
  }

  async getOrderById(userId: number, orderId: number, role: string) {
    try {
      if (role == "ADMIN") {
        return this.prisma.order.findUnique({
          where: { id: orderId },
          include: {
            orderItems: {
              include: { product: true },
            },
          },
        });
      }
      const order = await this.prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        throw new Error("Order not found or user does not own this order.");
      }

      return order;
    } catch (error: any) {
      console.log(`Error occurred due to ${error.message}`);
      throw new InternalServerErrorException("Failed to get order");
    }
  }

  async getAllOrdersByUser(userId: number, role: string) {
    try {
      if (role === "ADMIN") {
        return this.prisma.order.findMany({
          include: {
            orderItems: {
              include: { product: true },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      return this.prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error: any) {
      console.log(`The error occurred due to: ${error.message}`);
      throw new InternalServerErrorException("Failed to get all orders");
    }
  }

  async updateOrderStatus(orderId: number, newStatus: string): Promise<string> {
    const order = await this.prisma.order.findUnique({ where: { id: Number(orderId) } });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: OrderStatus[newStatus] },
      });

      const user = await this.prisma.user.findUnique({ where: { id: updatedOrder.userId } });
      if (user) {
        await this.emailService.AddStatusUpdateEmail(user.email, updatedOrder.id, newStatus);
      }

      this.appGateway.emitOrderStatusUpdate(updatedOrder.id.toString(), newStatus);

      return `Order status updated to ${newStatus}`;
    } catch (error) {
      console.log(`Failed to update order status due to: ${error.message}`);
      throw new InternalServerErrorException("Failed to update order status");
    }
  }
}
