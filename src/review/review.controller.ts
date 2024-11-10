import { Controller, Post, Body, Param, ParseIntPipe, Request } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ApiTags, ApiParam, ApiResponse } from "@nestjs/swagger";

@ApiTags("reviews")
@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(":productId")
  @ApiParam({ name: "productId", type: "number", description: "ID of the product" })
  @ApiResponse({ status: 201, description: "Review added successfully" })
  @ApiResponse({ status: 403, description: "User has not purchased the product" })
  async addReview(@Param("productId", ParseIntPipe) productId: number, @Body() createReviewDto: CreateReviewDto, @Request() req) {
    const userId = req.user.id;
    return this.reviewService.addReview(userId, productId, createReviewDto.rating, createReviewDto.comment);
  }
}
