import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  discount: number;
}
