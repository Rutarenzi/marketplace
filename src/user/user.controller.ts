import { Controller, Post, Body, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
// import { CreateAddressDto } from "./dto/create-address.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async register(@Body() dto: CreateUserDto) {
    return this.userService.registerUser(dto);
  }

  @Get(":id/profile")
  async getProfile(@Param("id") userId: number) {
    return this.userService.getUserProfile(+userId);
  }

  @Patch(":id/profile")
  @UseGuards(AuthGuard)
  @Roles("ADMIN")
  async updateProfile(@Param("id") userId: number, @Body() dto: UpdateProfileDto) {
    return this.userService.updateUserProfile(+userId, dto);
  }

  // @Post(":id/address")
  // async addAddress(@Param("id") userId: number, @Body() dto: CreateAddressDto) {
  //   return this.userService.addAddress(+userId, dto);
  // }

  @Get(":id/addresses")
  async getAddresses(@Param("id") userId: number) {
    return this.userService.getUserAddresses(+userId);
  }
}
