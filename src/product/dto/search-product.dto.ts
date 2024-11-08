// dto/search-product.dto.ts
import { IsString, IsOptional, IsInt, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SearchProductDto {
  @ApiProperty({ description: "Search term for product title or description", example: "Laptop", required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: "Category ID to filter products by category", example: 1, required: false })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: "Whether to include only featured products", example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class MarkFeaturedDto {
  @ApiProperty({ description: "Product ID to be marked as featured", example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ description: "Mark product as featured", example: true })
  @IsBoolean()
  isFeatured: boolean;
}
