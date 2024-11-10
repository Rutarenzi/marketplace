import { Controller, Post, Get, Body, Patch, Param, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { MarkFeaturedDto, SearchProductDto } from "./dto/search-product.dto";
import { Roles } from "src/auth/roles.decorator";
import { Public } from "src/auth/public.decorator";

@ApiTags("products")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("create")
  @ApiOperation({ summary: "Create a product" })
  @ApiBody({ type: CreateProductDto })
  @Roles("ADMIN")
  async createProduct(@Body() productData: CreateProductDto) {
    const Product = await this.productService.createProduct(productData);
    return Product;
  }

  @Get()
  @Public()
  async getAllProducts() {
    const products = await this.productService.getAllProducts();
    return products;
  }
  @Get("search")
  @Public()
  async searchProducts(@Query() searchProductDto: SearchProductDto) {
    return this.productService.searchProducts(searchProductDto);
  }

  @Get("category/:categoryId")
  @Public()
  async getProductsByCategory(@Param("categoryId") categoryId: number) {
    return this.productService.getProductsByCategory(categoryId);
  }
  @Patch("mark-featured")
  @Roles("ADMIN")
  async markProductAsFeatured(@Body() markFeaturedDto: MarkFeaturedDto) {
    return this.productService.markProductAsFeatured(markFeaturedDto);
  }
}
