import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppGateway } from "./app/app.gateway";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bull";
import { SharedModule } from "./shared/shared.module";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "Ruta1234",
      signOptions: { expiresIn: "1h" },
    }),
    PrismaModule,
    SharedModule,
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],
  providers: [
    AppGateway,
    PrismaModule,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
