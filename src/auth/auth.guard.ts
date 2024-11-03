import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, forwardRef } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { RequestWithUser } from "./dto/requestuser.dto";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authorization token missing or invalid.");
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "Ruta1234",
      });
      const user = await this.userService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException("User not found.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      request.user = user;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException(`Token verification failed due ${error.message}`);
    }
  }
}
