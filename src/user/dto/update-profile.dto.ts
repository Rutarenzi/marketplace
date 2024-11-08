import { IsOptional, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @MaxLength(50, { message: "Name must be less than 50 characters" })
  name?: string;

  // to update more field here!!!!
}
