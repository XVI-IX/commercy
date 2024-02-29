import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ReviewDto, UpdateProductDto } from './dto';
import { User } from 'src/decorator';
import { CreateCartDto } from 'src/cart/dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  createProduct(@User() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.addProduct(user.sub, dto);
  }

  @Get()
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  getAllProducts(@Query() query: any) {
    return this.productsService.getAllProducts(query);
  }

  @Get('/:productId')
  @HttpCode(200)
  getProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.getProductById(productId);
  }

  @Get('/search/product')
  @HttpCode(200)
  searchProduct(@Query() query: any) {
    return this.productsService.searchProducts(query);
  }

  @Put('/:productId')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, dto);
  }

  @Post('/:productId/reviews')
  @HttpCode(200)
  addReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: ReviewDto,
    @User() user: any,
  ) {
    return this.productsService.addReview(user, productId, dto);
  }

  @Get('/:productId/reviews')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  getReviews(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.getReviews(productId);
  }

  @Get('/:productId/rating')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  getRating(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.getRating(productId);
  }

  @Delete('/:productId')
  @HttpCode(200)
  deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.deleteProduct(productId);
  }

  @Post('/:productId/add-to-cart')
  @HttpCode(200)
  addToCart(
    @User() user: any,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateCartDto,
  ) {
    return this.productsService.addToCart(user, productId, dto);
  }
}
