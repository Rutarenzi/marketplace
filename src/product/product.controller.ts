import { Controller, Post, UseInterceptors, Body, UploadedFiles } from "@nestjs/common";
import { ApiConsumes, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadFilesInterceptor } from "./interceptors/file.interceptor";
import { CreateProductWithFilesDto } from "./dto/createProductFile.dto";

@ApiTags("products")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("create")
  @ApiOperation({ summary: "Create a product" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateProductWithFilesDto })
  @UseInterceptors(FilesInterceptor("images", 5, new UploadFilesInterceptor().createMulterOptions()))
  async createProduct(@Body() productData: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
    const imagePaths = images.map(file => file.path);
    const product = await this.productService.createProduct(productData, imagePaths);
    return product;
  }
}
