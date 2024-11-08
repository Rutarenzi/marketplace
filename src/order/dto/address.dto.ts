import { ApiProperty } from "@nestjs/swagger";

export class PlaceOrderDto {
  @ApiProperty({ description: "ID of the address to be used for the order", default: 1 })
  addressId: number;
}
