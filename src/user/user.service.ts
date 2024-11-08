import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
// import { CreateAddressDto } from "./dto/create-address.dto";
import * as bcrypt from "bcrypt";
import { AuthService } from "src/auth/auth.service";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  async registerUser(dto: CreateUserDto) {
    try {
      const existingUser = await this.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
      });
      const token = this.authService.generateToken(user.id, user.email, user.role);
      // await this.mailService.AddVerification(user.email, token.access_token);
      return { id: user.id, email: user.email, name: user.name, token: token.access_token };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        console.error("Failed to register user:", error.message);
        throw new InternalServerErrorException("Failed to register user");
      }
    }
  }

  // Find user by email
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Get user profile by ID
  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, addresses: true },
    });
    if (!user) throw new NotFoundException("User not found");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Update user profile
  async updateUserProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
    });
    return user;
  }

  // Add a new address for the user
  // async addAddress(userId: number, dto: CreateAddressDto) {
  //   const address = await this.prisma.address.create({
  //     data: {
  //       userId,
  //       ...dto,
  //     },
  //   });
  //   return address;
  // }

  // Get all addresses for a user
  async getUserAddresses(userId: number) {
    return this.prisma.address.findMany({ where: { userId } });
  }
}
