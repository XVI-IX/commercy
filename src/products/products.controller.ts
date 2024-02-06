import { Controller, Get, Post, Body, HttpCode, Param, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
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
  searchProduct(@Param('q') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Put('/:productId')
  @HttpCode(200)
  updateProduct(@Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(productId, dto);
  }

  @Delete('/:productId')
  @HttpCode(200)
  deleteProduct(@Param('productId') productId: string) {
    return this.productsService.deleteProduct(productId)
  }
}
