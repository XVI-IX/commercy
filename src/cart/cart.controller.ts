import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
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
