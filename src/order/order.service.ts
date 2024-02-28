import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostgresService } from 'src/postgres/postgres.service';
import { User } from 'src/user/entities/user.entity';
import { CheckoutDto, UpdateOrderDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
  constructor(
    private pg: PostgresService,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkout(user: User, dto: CheckoutDto) {
    try {
      const orderQuery =
        'INSERT INTO orders (user_id, total_price, shippingAddress) VALUES ($1, $2, $3)';
      const orderValues = [user.sub, dto.total_price, dto.shippingAddress];

      const orderResult = await this.pg.query(orderQuery, orderValues);

      if (!orderResult) {
        throw new InternalServerErrorException(
          'Something went wrong with your order, please try again',
        );
      }

      const orderItemsQuery =
        'INSERT INTO orderItems (product_id, quantity, price) VALUES ($1, $2, $3)';
      for (const item of dto.orderItems) {
        const values = [item.product_id, item.quantity, item.price];
        const query = await this.pg.query(orderItemsQuery, values);
      }

      const data = {};

      this.eventEmitter.emit('order.payment', data);

      return {
        message: 'Order placed',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error('Order could not be placed');
      throw error;
    }
  }

  async getOrders(user: User) {
    try {
      const query = 'SELECT * FROM orders WHERE user_id = $1';
      const values = [user.sub];

      const result = await this.pg.query(query, values);

      if (!result) {
        throw new InternalServerErrorException('Orders could not be retrieved');
      }

      return {
        message: 'Orders retrieved',
        status: 'success',
        statusCode: 200,
        data: result.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrderById(user: User, orderId: number) {
    try {
      const query = 'SELECT * FROM orders WHERE user_id = $1 AND order_id = $2';
      const values = [user.sub, orderId];

      const result = await this.pg.query(query, values);

      if (!result) {
        throw new InternalServerErrorException('Order could not be retrieved');
      }

      return {
        message: 'Order retrieved',
        status: 'success',
        statusCode: 200,
        data: result.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
