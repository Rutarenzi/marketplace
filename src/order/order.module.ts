import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailModule } from "src/mail/mail.module";
import { AppGateway } from "src/app/app.gateway";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, MailModule, JwtModule],
  providers: [OrderService, AppGateway],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
