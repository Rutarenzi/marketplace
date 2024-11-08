import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule, JwtModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
