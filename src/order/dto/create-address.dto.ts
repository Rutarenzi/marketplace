import { IsString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AddressType } from "@prisma/client";

export class CreateAddressDto {
  @ApiProperty({ example: "KN 202 st" })
  @IsString()
  street: string;

  @ApiProperty({ example: "Nyakabanda" })
  @IsString()
  city: string;

  @ApiProperty({ example: "KIGALI" })
  @IsString()
  state: string;

  @ApiProperty({ example: "00000" })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: "RWANDA" })
  @IsString()
  country: string;

  @ApiProperty({ example: "SHIPPING" })
  @IsEnum(AddressType)
  type: AddressType;
}
