import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppGateway } from "./app/app.gateway";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bull";
import { SharedModule } from "./shared/shared.module";
import * as dotenv from "dotenv";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/role.guard";
import { AuthGuard } from "./auth/auth.guard";

dotenv.config();

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "Ruta1234",
      signOptions: { expiresIn: "1h" },
    }),
    SharedModule,
    BullModule.forRoot({
      redis: {
        host: "redis",
        port: 6379,
      },
    }),
  ],
  providers: [
    AppGateway,
    PrismaModule,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AppGateway],
})
export class AppModule {}
