import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsPhoneNumber } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({ example: "I am Ruta software engineer", description: "Bio of the user", required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: "0792415011", description: "Phone number of the user", required: false })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
