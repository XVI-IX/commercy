import { Injectable, Body } from '@nestjs/common';
// import { CreateCartDto, UpdateCartDto } from './dto';
// import { User } from 'src/decorator';
import { PostgresService } from 'src/postgres/postgres.service';

@Injectable()
export class CartService {
  constructor(private pg: PostgresService) {}

  // addToCart(user, @Body() dto: CreateCartDto) {
  //   try {
  //     const query = 'INSERT INTO cart_items VALUES ()';
  //     const values = [

  //     ]
  //     const cart = await this.pg.query();
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
}
