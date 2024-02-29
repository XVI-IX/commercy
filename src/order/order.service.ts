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
    let total_price = 0;
    for (const item of dto.orderItems) {
      total_price += item.price * item.quantity;
    }
    try {
      const order = await this.prisma.orders.create({
        data: {
          user: {
            connect: {
              id: user.sub,
            },
          },
          total_price: total_price,
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
        // order: { connect: { id: order.id } },
        order_id: order.id, // Connect to the created order
      }));

      console.log(orderItemsData);

      const orderItems = await this.prisma.orderItems.createMany({
        data: orderItemsData,
      });

      if (!orderItems) {
        throw new InternalServerErrorException(
          'Order could not be placed please try again',
        );
      }

      const data = {};

      this.eventEmitter.emit('order.payment', data);

      return {
        message: 'Order placed',
        status: 'success',
        statusCode: 200,
        data: order,
      };
    } catch (error) {
      console.error('Order could not be placed');
      throw error;
    }
  }

  async getOrders(user: User) {
    try {
      const orders = await this.prisma.orders.findMany({
        where: {
          user_id: user.sub,
        },
      });

      if (!orders) {
        throw new InternalServerErrorException('Orders could not be retrieved');
      }

      return {
        message: 'Orders retrieved',
        status: 'success',
        statusCode: 200,
        data: orders,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrderById(user: User, orderId: number) {
    try {
      const order = await this.prisma.orders.findUnique({
        where: {
          user_id: user.sub,
          id: orderId,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Order could not be retrieved');
      }

      return {
        message: 'Order retrieved',
        status: 'success',
        statusCode: 200,
        data: order,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
