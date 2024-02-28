import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishListDto } from './dto';
import { User } from 'src/decorator';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('/:productId')
  @HttpCode(200)
  addToWishlist(
    @User() user: any,
    @Param('productId', ParseIntPipe) product_id: number,
    @Body() dto: WishListDto,
  ) {
    return this.wishlistService.addToWishlist(user, product_id, dto);
  }

  @Get()
  @HttpCode(200)
  getWishlist(@User() user: any) {
    return this.wishlistService.getWishlist(user);
  }

  @Delete('/:productId')
  @HttpCode(200)
  deleteFromWishlist(
    @User() user: any,
    @Param('productId', ParseIntPipe) product_id: number,
  ) {
    return this.wishlistService.deleteFromWishlist(user, product_id);
  }

  @Delete()
  @HttpCode(200)
  clearWishlist(@User() user: any) {
    return this.wishlistService.clearWishlist(user);
  }
}
