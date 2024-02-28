import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from 'src/postgres/postgres.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    private pg: PostgresService,
    private prisma: PrismaService,
  ) {}

  async getCartItems(user: User) {
    try {
      const cart = await this.prisma.cart_items.findMany({
        where: {
          cart_id: user.cart_id,
        },
      });

      if (!cart) {
        throw new InternalServerErrorException('Cart could not be retrieved');
      }

      if (cart.length === 0) {
        throw new NotFoundException('Cart has no items');
      }

      return {
        message: 'Cart items retrieved.',
        status: 'success',
        statusCode: 200,
        data: cart,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeFromCart(user: User, product_id: number) {
    try {
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCartItem(user: User, productId: number) {
    try {
      if (!user || !productId) {
        throw new BadRequestException('Invalid parameters');
      }

      const cart = await this.prisma.cart_items.deleteMany({
        where: {
          cart_id: user.cart_id,
          product_id: productId,
        },
      });

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

  async clearCart(user: User) {
    try {
      const cart = await this.prisma.cart_items.deleteMany({
        where: {
          cart_id: user.cart_id,
        },
      });

      if (!cart) {
        throw new InternalServerErrorException('Cart could not be cleared');
      }

      return {
        message: 'Cart cleared successfully',
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
