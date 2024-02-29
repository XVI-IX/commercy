import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [PrismaModule],
})
export class WishlistModule {}
