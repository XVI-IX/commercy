import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  avatar: string;

  @IsString()
  billing_address: string;

  @IsString()
  shipping_address: string;

  @IsString()
  phone_number: string;

  @IsString()
  date_of_birth: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsIn(['User', 'Admin'])
  user_role?: string;
}
