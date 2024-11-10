import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [PrismaModule, UserModule, JwtModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
