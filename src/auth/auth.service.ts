import { Injectable, UnauthorizedException, InternalServerErrorException, forwardRef, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import * as bcrypt from "bcrypt";
import { Role } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.findByEmail(loginUserDto.email);
      if (!user) {
        throw new UnauthorizedException("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email or password");
      }
      return this.generateToken(user.id, user.email, user.role);
    } catch (error) {
      console.error("Login error:", error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException("An error occurred. Please try again.");
    }
  }

  generateToken(userId: number, email: string, role: Role) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }
}
