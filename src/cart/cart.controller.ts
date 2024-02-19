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
// import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/')
  async getCartItems(@User() user: any) {
    return this.cartService.getCartItems(user);
  }

  @Delete('/:productId')
  async deleteCartItem(
    @User() user: any,
    @Param('productId') productId: string,
  ) {
    return this.cartService.deleteCartItem(user, productId);
  }
}
