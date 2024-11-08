import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule, JwtModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
