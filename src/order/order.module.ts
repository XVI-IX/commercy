import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PostgresService } from 'src/postgres/postgres.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PostgresService],
})
export class OrderModule {}
