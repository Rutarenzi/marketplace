import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OrderService } from "../order/order.service";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException, Injectable } from "@nestjs/common";

@WebSocketGateway({ namespace: "/", cors: true })
@Injectable()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly orderService: OrderService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit() {
    console.log("WebSocket initialized!!!");
  }

  // Handle client connection
  async handleConnection(client: Socket) {
    const token = client.handshake.headers["authorization"];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token.split(" ")[1]);
        client.data.user = decoded;
        console.log("Authenticated client connected:", decoded);
      } catch (error: any) {
        client.disconnect();
        throw new UnauthorizedException(`Invalid token ${error.message}`);
      }
    } else {
      console.log("Unauthenticated client connected:", client.id);
    }
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log("Client disconnected:", client.data.user?.id || client.id);
  }

  @SubscribeMessage("trackOrderStatus")
  async handleTrackOrderStatus(@MessageBody() data: { orderId: string; status: string }, @ConnectedSocket() client: Socket) {
    if (!client.data.user) {
      client.emit("error", "Authentication required for order tracking.");
      return;
    }
    const user = client.data.user;
    const order = await this.orderService.getOrderStatus(Number(data.orderId), user.id);
    if (!order) {
      client.emit("error", "Order not found or access denied.");
      return;
    }

    console.log(`User ${user.id} is tracking order status for orderId: ${data.orderId}`);

    client.join(data.orderId);
    client.emit("orderStatusUpdate", { orderId: data.orderId, status: data.status });
  }
  emitOrderStatusUpdate(orderId: string, status: string) {
    this.server.to(orderId).emit("orderStatusUpdate", { orderId, status });
  }
}
