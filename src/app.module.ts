import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PostgresModule } from './postgres/postgres.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ProductsModule, CartModule, OrderModule, PostgresModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
