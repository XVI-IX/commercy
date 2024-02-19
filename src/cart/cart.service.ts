import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { CreateCartDto, UpdateCartDto } from './dto';
// import { User } from 'src/decorator';
import { PostgresService } from 'src/postgres/postgres.service';

@Injectable()
export class CartService {
  constructor(private pg: PostgresService) {}

  async getCartItems(user: any) {
    try {
      const cart = await this.pg.query(
        'SELECT * FROM cart_items WHERE cart_id = $1',
        [user.cart_id],
      );

      console.log(user);
      console.log(cart.rows);

      if (!cart) {
        throw new InternalServerErrorException('Cart could not be retrieved');
      }

      // console.log(cart);

      if (cart.rows.length === 0) {
        throw new NotFoundException('Cart has no items');
      }

      return {
        message: 'Cart items retrieved.',
        status: 'success',
        statusCode: 200,
        data: cart.rows[0],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCartItem(user: any, productId: string) {
    try {
      if (!user || !productId) {
        throw new BadRequestException('Invalid parameters');
      }

      const cart = await this.pg.query(
        'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
        [user.cart_id, productId],
      );

      if (!cart) {
        throw new InternalServerErrorException(
          'Item could not be deleted from cart.',
        );
      }

      return {
        message: 'Item deleted from cart',
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
