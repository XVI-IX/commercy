import { Injectable, Body } from '@nestjs/common';
import { CreateCartDto, UpdateCartDto } from './dto';
import { User } from 'src/decorator';

@Injectable()
export class CartService {
  addToCart(@User() user: any, @Body() dto: CreateCartDto) {
    try {
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
