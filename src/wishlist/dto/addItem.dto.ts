import { IsNotEmpty, IsString } from 'class-validator';

export class WishListDto {
  @IsString()
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  @IsString()
  product_img: string;
}
