import {
  Injectable,
  Body,
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

      if (!cart) {
        throw new InternalServerErrorException('Cart could not be retrieved');
      }

      if (cart.rows[0].length === 0) {
        throw new NotFoundException('Cart has no items');
      }

      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
