import { IsNotEmpty, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  rating: number;
}
