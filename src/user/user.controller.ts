import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { ApiProfileCreateResponses, ApiProfileResponses } from "src/common/decorators/swagger-response.decorator";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { Public } from "src/auth/public.decorator";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post("register")
  async register(@Body() dto: CreateUserDto) {
    return this.userService.registerUser(dto);
  }
  @Post("profile/create")
  @ApiProfileCreateResponses()
  @UseGuards(AuthGuard)
  @Roles("USER")
  async createProfile(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    const userId = req.user.id;
    const profile = await this.userService.createProfileIfNotExist(userId, createProfileDto);
    return profile;
  }

  @Get("Profile")
  @ApiProfileResponses()
  @UseGuards(AuthGuard)
  @Roles("USER")
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const profile = await this.userService.getProfileByUserId(userId);
    return profile;
  }
}
