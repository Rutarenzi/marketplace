import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @IsString()
  @ApiProperty({ example: "Air jordan 23", description: "The title of the product" })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "This is a sample product description.", required: false })
  description?: string;

  @IsNumber()
  @ApiProperty({ example: 40000, description: "The price of the product" })
  price: number;

  @IsNumber()
  @ApiProperty({ example: 100, description: "The stock available for the product" })
  stock: number;

  @IsNumber()
  @ApiProperty({ example: 1, description: "The category ID for the product" })
  categoryId: number;
}
