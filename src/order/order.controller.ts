import { Controller, Post, Body, Get, Request, Param, ParseIntPipe } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "src/auth/roles.decorator";
import { CreateAddressDto } from "./dto/create-address.dto";
import { PlaceOrderDto } from "./dto/address.dto";
import { ApiBody, ApiParam } from "@nestjs/swagger";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post("address")
  @Roles("USER")
  async createAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.id;
    return this.orderService.createAddress(userId, createAddressDto);
  }

  @Get("address")
  @Roles("USER")
  async getAddressByUserId(@Request() req) {
    const userId = req.user.id;
    return this.orderService.getAddressById(userId);
  }

  @Post("place-order")
  @Roles("USER")
  async placeOrder(@Request() req, @Body() placeOrderDto: PlaceOrderDto) {
    const userId = req.user.id;
    const { addressId } = placeOrderDto;
    const { order, totalAmount } = await this.orderService.placeOrder(userId, addressId);
    return { order, totalAmount };
  }
  @Get(":orderId")
  @Roles("USER", "ADMIN")
  async getOrderById(@Request() req, @Param("orderId", ParseIntPipe) orderId: number) {
    const { id: userId, role } = req.user;
    const order = await this.orderService.getOrderById(userId, orderId, role);
    return order;
  }

  @Get()
  @Roles("USER", "ADMIN")
  async getAllOrdersByUser(@Request() req) {
    const { id: userId, role } = req.user;
    const orders = await this.orderService.getAllOrdersByUser(userId, role);
    return orders;
  }
  @Post(":orderId/status")
  @Roles("ADMIN")
  @ApiParam({ name: "orderId", type: Number, description: "Order ID to update" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        newStatus: {
          type: "string",
          default: " COMPLETED",
          description: "New status for the order",
        },
      },
    },
  })
  async updateOrderStatus(@Param("orderId") orderId: number, @Body("newStatus") newStatus: string): Promise<string> {
    return this.orderService.updateOrderStatus(orderId, newStatus);
  }
}
