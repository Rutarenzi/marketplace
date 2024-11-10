import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import * as bcrypt from "bcrypt";
import { AuthService } from "src/auth/auth.service";
import { MailService } from "src/mail/mail.service";
import { User } from "@prisma/client";

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
      await this.mailService.AddVerification(user.email, token.access_token);
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
  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createProfileIfNotExist(userId: number, createProfileDto: CreateProfileDto) {
    try {
      let profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (profile) {
        throw new NotFoundException("Profile already exists");
      }

      profile = await this.prisma.profile.create({
        data: { userId, ...createProfileDto },
      });

      return "Created successfully";
    } catch (error: any) {
      console.log(`Error occured due: ${error.message}`);
      throw new InternalServerErrorException("Failed to create profile");
    }
  }
  async getProfileByUserId(userId: number) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        throw new NotFoundException("Profile not found");
      }

      return profile;
    } catch (error: any) {
      console.log(`Failed to get profile due to: ${error.message}`);
      throw new InternalServerErrorException("Failed to get profile");
    }
  }
}
