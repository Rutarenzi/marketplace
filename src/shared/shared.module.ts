import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { OrderModule } from "../order/order.module";
import { CategoryModule } from "../category/category.module";
import { ReviewModule } from "../review/review.module";
import { WishlistModule } from "../wishlist/wishlist.module";
import { CartModule } from "../cart/cart.module";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [UserModule, ProductModule, OrderModule, CategoryModule, ReviewModule, WishlistModule, CartModule, PaymentModule],
  exports: [UserModule, ProductModule, OrderModule, CategoryModule, ReviewModule, WishlistModule, CartModule, PaymentModule],
})
export class SharedModule {}
