import { IsString, IsOptional, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ description: "Name of the category", example: "Electronics" })
  @IsString()
  name: string;

  @ApiProperty({ description: "ID of the parent category if it is a subcategory", example: null, required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
