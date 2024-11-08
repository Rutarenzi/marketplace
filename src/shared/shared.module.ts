import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { CategoryModule } from "../category/category.module";
import { ReviewModule } from "../review/review.module";
import { WishlistModule } from "../wishlist/wishlist.module";
import { CartModule } from "../cart/cart.module";
import { PaymentModule } from "../payment/payment.module";
import { OrderModule } from "src/order/order.module";

@Module({
  imports: [UserModule, ProductModule, CartModule, OrderModule, CategoryModule, ReviewModule, WishlistModule, PaymentModule],
  exports: [UserModule, ProductModule, CartModule, CategoryModule, OrderModule, ReviewModule, WishlistModule, PaymentModule],
})
export class SharedModule {}
