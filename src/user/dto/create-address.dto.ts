import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty({ message: "Street is required" })
  @MaxLength(30, { message: "Street must be less than 30 characters" })
  street: string;

  @IsNotEmpty({ message: "City is required" })
  @MaxLength(50, { message: "City must be less than 50 characters" })
  city: string;

  @IsNotEmpty({ message: "Postal code is required" })
  @MaxLength(20, { message: "Postal code must be less than 20 characters" })
  postalCode: string;

  @IsNotEmpty({ message: "Country is required" })
  @MaxLength(50, { message: "Country must be less than 50 characters" })
  country: string;
}
