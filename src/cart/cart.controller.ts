import { Controller, Post, Body, Param, ParseIntPipe, Request, Get } from "@nestjs/common";
import { CartService } from "./cart.service";
import { Roles } from "src/auth/roles.decorator";
import { ApiBody, ApiParam } from "@nestjs/swagger";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post(":productId")
  @Roles("USER")
  @ApiParam({ name: "productId", description: "ID of the product to add", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        quantity: {
          type: "integer",
          example: 1,
          description: "Quantity of the product to add",
          default: 1,
        },
      },
    },
  })
  async addProductToCart(@Request() req, @Param("productId", ParseIntPipe) productId: number, @Body("quantity", ParseIntPipe) quantity: number = 1) {
    const userId: number = req.user.id;
    const cartItem = await this.cartService.addProductToCart(userId, productId, quantity);
    return cartItem;
  }
  @Get()
  @Roles("USER")
  async getCart(@Request() req) {
    const userId: number = req.user.id;
    const cart = await this.cartService.getCart(userId);
    return cart;
  }
}
