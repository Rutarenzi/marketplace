import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto, imagePaths: string[]) {
    const { title, description, price, stock, categoryId } = createProductDto;
    const productExist = await this.prisma.product.findFirst({ where: { title } });
    if (productExist) {
      throw new ConflictException("The product exist in store");
    }
    const categoryExist = await this.prisma.product.findFirst({ where: { categoryId } });
    if (!categoryExist) {
      throw new NotFoundException("Invalid category");
    }
    const product = await this.prisma.$transaction(async prisma => {
      const newProduct = await prisma.product.create({
        data: {
          title,
          description,
          price,
          stock,
          categoryId,
        },
      });

      const images = await prisma.productImage.createMany({
        data: imagePaths.map(path => ({
          url: path,
          productId: newProduct.id,
          altText: newProduct.title,
        })),
      });

      return { ...newProduct, images };
    });

    return product;
  }
}
