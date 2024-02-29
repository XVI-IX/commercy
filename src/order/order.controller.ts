import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from 'src/decorator';
import { CheckoutDto } from './dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  checkout(@User() user, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(user, dto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  getOrders(@User() user) {
    return this.orderService.getOrders(user);
  }

  @Get('/:id')
  @UseInterceptors(CacheInterceptor)
  getOrderById(@User() user, @Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderById(user, orderId);
  }
}
