// cart.service.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addProductToCart(userId: number, productId: number, quantity: number = 1) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    if (product.stock < quantity) {
      throw new BadRequestException("Insufficient stock for this product");
    }

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
  }
  async getCart(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException("Cart is empty");
    }

    return cartItems;
  }
}
