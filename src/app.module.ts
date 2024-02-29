import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PostgresModule } from './postgres/postgres.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UserModule,
    ProductsModule,
    CartModule,
    OrderModule,
    PostgresModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule,
    EmailModule,
    EventEmitterModule.forRoot(),
    WishlistModule,
    NotificationsModule,
    DashboardModule,
    CheckoutModule,
    PrismaModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
