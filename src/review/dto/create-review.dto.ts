// dto/create-review.dto.ts
import { IsInt, IsString, Min, Max, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewDto {
  @ApiProperty({ description: "Rating of the product", minimum: 1, maximum: 5, example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: "Comment about the product", example: "Great quality!" })
  @IsString()
  @IsOptional()
  comment?: string;
}
