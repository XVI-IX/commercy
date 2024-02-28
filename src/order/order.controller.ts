import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from 'src/decorator';
import { CheckoutDto } from './dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@User() user, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(user, dto);
  }
}
