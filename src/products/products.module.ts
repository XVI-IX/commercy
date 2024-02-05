import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PostgresModule],
})
export class ProductsModule {}
