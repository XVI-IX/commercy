import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CheckoutDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async checkout(user: User, dto: CheckoutDto) {
    try {
      const order = await this.prisma.orders.create({
        data: {
          user: {
            connect: {
              id: user.sub,
            },
          },
          total_price: dto.total_price,
          shippingAddress: dto.shippingAddress,
          billingAddress: dto.billingAddress,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Orders could not be created');
      }

      const orderItemsData = dto.orderItems.map((orderItem) => ({
        product_id: orderItem.product_id,
        quantity: orderItem.quantity,
        price: orderItem.price,
        order: { connect: { id: order.id } },
        order_id: order.id, // Connect to the created order
      }));

      const orderItems = await this.prisma.orderItems.createMany({
        data: orderItemsData,
      });

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
