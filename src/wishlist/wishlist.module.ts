import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [PostgresModule],
})
export class WishlistModule {}
