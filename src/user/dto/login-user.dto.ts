import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  @ApiProperty({ example: "rutagaramaaxcel@gmail.com" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @ApiProperty({ example: "H1e2lloword" })
  password: string;
}
