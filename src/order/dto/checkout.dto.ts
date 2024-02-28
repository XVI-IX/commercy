import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

interface orderItems {
  product_id: number;
  quantity: number;
  price: number;
}

export class CheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  total_price: number;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  billingAddress?: string;

  orderItems: orderItems[];
}
