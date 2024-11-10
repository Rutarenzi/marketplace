import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/auth/roles.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/role.guard";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({ status: 201, description: "Category created successfully" })
  @ApiResponse({ status: 409, description: "Category with this name already exists" })
  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: "Retrieve all categories with subcategories" })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
