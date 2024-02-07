import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ReviewDto, UpdateProductDto } from './dto';
import { User } from 'src/decorator';

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
  getAllProducts(@Param() query: any) {
    return this.productsService.getAllProducts(query);
  }

  @Get('/search')
  @HttpCode(200)
  searchProduct(@Param() query: any) {
    return this.productsService.searchProducts(query);
  }

  @Put('/:productId')
  @HttpCode(200)
  updateProduct(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, dto);
  }

  @Post('/:productId/reviews')
  @HttpCode(200)
  addReview(
    @Param('productId') productId,
    @Body() dto: ReviewDto,
    @User() user: any,
  ) {
    return this.productsService.addReview(user, productId, dto);
  }

  @Get('/:productId/reviews')
  @HttpCode(200)
  getReviews(@Param('productId') productId: string) {
    return this.productsService.getReviews(productId);
  }

  @Delete('/:productId')
  @HttpCode(200)
  deleteProduct(@Param('productId') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
