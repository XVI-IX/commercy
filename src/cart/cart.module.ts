import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [PostgresModule],
})
export class CartModule {}
