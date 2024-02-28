import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CreateCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(user: User, dto: CreateCartDto) {
    try {
      const cart = await this.prisma.cart_items.create({
        data: {
          cart: {
            connect: {
              id: user.cart_id,
            },
          },
          product_name: dto.product_name,
          product_img: dto.product_img,
          price: dto.price,
          discount: dto.discount,
          product_id: dto.product_id,
          quantity: dto.quantity,
          product_description: dto.product_description,
        },
      });

      if (!cart) {
        throw new InternalServerErrorException(
          'Item could not be added to cart',
        );
      }

      return {
        message: 'Item added to cart',
        status: 'success',
        statusCode: 200,
        data: cart,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
      const item = await this.prisma.cart_items.deleteMany({
        where: {
          product_id: product_id,
          cart_id: user.cart_id,
        },
      });

      if (!item) {
        throw new InternalServerErrorException(
          'Item could not be removed from cart',
        );
      }

      return {
        message: 'Item removed from cart',
        status: 'success',
        statusCode: 200,
        data: null,
      };
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
