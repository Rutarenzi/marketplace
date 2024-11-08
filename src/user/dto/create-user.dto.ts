import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  @ApiProperty({ example: "rutagaramaxcel@gmail.com", description: "Your unique email" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(20, { message: "Password must be less than 20 characters" })
  @ApiProperty({ example: "H1e2lloword" })
  password: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(50, { message: "Name must be less than 50 characters" })
  @ApiProperty({ example: "Axcel" })
  name: string;
}
