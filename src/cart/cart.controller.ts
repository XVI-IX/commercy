import {
  Controller,
  Get,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Post,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from 'src/decorator';
import { CreateCartDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/')
  async addToCart(@User() user: any, @Body() dto: CreateCartDto) {
    return this.cartService.addToCart(user, dto);
  }

  @Get('/')
  async getCartItems(@User() user: any) {
    return this.cartService.getCartItems(user);
  }

  @Put('/:productId/remove')
  @HttpCode(200)
  removeFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @User() user: any,
  ) {
    return this.cartService.removeFromCart(user, productId);
  }

  @Delete('/:productId')
  async deleteCartItem(
    @User() user: any,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.deleteCartItem(user, productId);
  }

  @Delete()
  async clearCart(@User() user: any) {
    return this.cartService.clearCart(user);
  }
}
