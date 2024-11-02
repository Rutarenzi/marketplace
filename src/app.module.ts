import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppGateway } from "./app/app.gateway";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { OrderModule } from "./order/order.module";
import { ReviewModule } from "./review/review.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { CartModule } from "./cart/cart.module";
import { PaymentModule } from "./payment/payment.module";
import { AuthModule } from "./auth/auth.module";
import { ProductModule } from "./product/product.module";

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    JwtModule.register({
      secret: "awesomitySecret",
      signOptions: { expiresIn: "1h" },
    }),
    UserModule,
    CategoryModule,
    OrderModule,
    ReviewModule,
    WishlistModule,
    CartModule,
    PaymentModule,
    AuthModule,
  ],
  providers: [AppGateway, PrismaModule],
})
export class AppModule {}
