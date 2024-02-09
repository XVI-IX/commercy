import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from 'src/postgres/postgres.service';
import { WishListDto } from './dto';

@Injectable()
export class WishlistService {
  constructor(private pg: PostgresService) {}

  async addToWishlist(user: any, product_id: string, dto: WishListDto) {
    try {
      const query =
        'INSERT INTO wishlists (user_id, product_id, link, product_img) VALUES ($1, $2, $3, $4)';
      const values = [user.sub, product_id, dto.link, dto.product_img];

      const result = await this.pg.query(query, values);

      if (!result) {
        throw new InternalServerErrorException(
          'Product could not be added to wishlist',
        );
      }

      return {
        message: 'Product has been added to wishlist',
        status: 'success',
        statusCode: 200,
        data: result.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getWishlist(user: any) {
    try {
      const wishlist = await this.pg.query(
        'SELECT * FROM wishlists WHERE user_id = $1',
        [user.sub],
      );

      if (wishlist.rows.length === 0) {
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
        data: wishlist.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteFromWishlist(user: any, product_id: string) {
    try {
      const query =
        'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2;';
      const values = [user.sub, product_id];

      const result = await this.pg.query(query, values);

      if (!result) {
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

  async clearWishlist(user: any) {
    try {
      const results = await this.pg.query(
        'DELETE FROM wishlist WHERE user_id = $1',
        [user.sub],
      );

      if (!results) {
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
