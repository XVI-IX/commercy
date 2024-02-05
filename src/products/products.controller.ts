import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
  getAllProducts() {
    return this.productsService.getAllProducts();
  }
}
