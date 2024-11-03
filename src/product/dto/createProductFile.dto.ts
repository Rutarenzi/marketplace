import { ApiProperty } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto"; // Import the DTO for product data

export class CreateProductWithFilesDto {
  @ApiProperty({ type: CreateProductDto })
  product: CreateProductDto;

  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
    description: "An array of image files to be uploaded",
  })
  images: any[];
}
