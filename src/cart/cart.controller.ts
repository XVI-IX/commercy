import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // @Post('/')
  // async addToCart(@User() user: any, @Body() dto: CreateCartDto) {
  //   return this.cartService.addToCart(user, dto);
  // }
}