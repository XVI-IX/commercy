import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from 'src/postgres/postgres.service';
import { WishListDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WishlistService {
  constructor(
    private pg: PostgresService,
    private prisma: PrismaService,
  ) {}

  async addToWishlist(user: User, product_id: number, dto: WishListDto) {
    try {
      const wishlist = await this.prisma.wishlists.create({
        data: {
          users: {
            connect: {
              id: user.sub,
            },
          },
          product_id: product_id,
          link: dto.link,
          product_img: dto.product_img,
        },
      });

      if (!wishlist) {
        throw new InternalServerErrorException(
          'Product could not be added to wishlist',
        );
      }

      return {
        message: 'Product has been added to wishlist',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getWishlist(user: User) {
    try {
      const wishlist = await this.prisma.wishlists.findMany({
        where: {
          user_id: user.sub,
        },
      });

      if (wishlist.length === 0) {
        throw new NotFoundException('You have no items in your wishlist');
      }
      if (!wishlist) {
        throw new InternalServerErrorException(
          'Your wishlist could not be retrieved',
        );
      }

      return {
        message: 'wishlist retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: wishlist,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteFromWishlist(user: User, product_id: number) {
    try {
      const wishlist = await this.prisma.wishlists.deleteMany({
        where: {
          user_id: user.sub,
          product_id: product_id,
        },
      });

      if (!wishlist) {
        throw new InternalServerErrorException(
          'Product could not be deleted from wishlist',
        );
      }

      return {
        message: 'Product deleted from wishlist',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async clearWishlist(user: User) {
    try {
      const wishlist = await this.prisma.wishlists.deleteMany({
        where: {
          user_id: user.sub,
        },
      });

      if (!wishlist) {
        throw new InternalServerErrorException('wishlist could not be cleared');
      }

      return {
        message: 'Wishlist cleared',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
