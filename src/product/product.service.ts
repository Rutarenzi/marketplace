import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "@prisma/client";
import { MarkFeaturedDto, SearchProductDto } from "./dto/search-product.dto";
import { Roles } from "src/auth/roles.decorator";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const { title, description, price, stock, categoryId } = createProductDto;
      const productExist = await this.prisma.product.findFirst({ where: { title } });
      if (productExist) {
        throw new ConflictException("The product exist in store");
      }
      const categoryExist = await this.prisma.category.findFirst({ where: { id: categoryId } });
      if (!categoryExist) {
        throw new NotFoundException("Invalid category");
      }

      const newProduct = await this.prisma.product.create({
        data: {
          title: title,
          description,
          price,
          stock,
          categoryId,
        },
      });

      return newProduct;
    } catch (error: any) {
      console.log("Create product failed due:", error.message);
      throw new InternalServerErrorException("Failed to create product");
    }
  }
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany();
    } catch (error: any) {
      console.log(`Failed to view all product ${error.message} `);
      throw new InternalServerErrorException("Failed to get all product");
    }
  }
  async searchProducts(searchProductDto: SearchProductDto) {
    const { search, categoryId, isFeatured } = searchProductDto;

    const conditions: any = {};
    if (search) {
      conditions.OR = [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
    }
    if (categoryId) conditions.categoryId = Number(categoryId);
    if (isFeatured !== undefined) {
      conditions.isFeatured = String(isFeatured) === "true";
    }
    return this.prisma.product.findMany({
      where: conditions,
      include: { category: true, reviews: true },
    });
  }
  async getProductsByCategory(categoryId: number) {
    const id = Number(categoryId);
    return this.prisma.product.findMany({
      where: { categoryId: id },
      include: { category: true, reviews: true },
    });
  }
  @Roles("ADMIN")
  async markProductAsFeatured(markFeaturedDto: MarkFeaturedDto) {
    const { productId, isFeatured } = markFeaturedDto;

    const product = await this.prisma.product.update({
      where: { id: productId },
      data: { isFeatured },
    });

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }
}
