import { IsBoolean, IsInt } from "class-validator";

export class BlockUserDto {
  @IsInt()
  userId: number;

  @IsBoolean()
  isBlocked: boolean;
}
