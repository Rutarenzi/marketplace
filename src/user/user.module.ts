import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { MailModule } from "src/mail/mail.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), MailModule, JwtModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
