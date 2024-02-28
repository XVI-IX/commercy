import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ReviewDto } from './dto';
import { CreateCartDto } from 'src/cart/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async addProduct(user_id: number, dto: CreateProductDto) {
    try {
      const product = await this.prisma.products.create({
        data: {
          users: {
            connect: {
              id: user_id,
            },
          },
          product_name: dto.product_name,
          price: dto.price,
          category: dto.category,
          quantity: dto.quantity,
          product_img: dto.product_img,
          product_description: dto.product_description,
        },
      });

      if (!product) {
        throw new InternalServerErrorException('Product could not be added.');
      }

      return {
        message: 'Product has been added successfully.',
        status: 'success',
        statusCode: 201,
        data: product,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllProducts(queryBody: any) {
    const { category, min_price, max_price, page = 1, limit = 10 } = queryBody;

    // let query = 'SELECT * FROM products LIMIT $1 OFFSET $2';
    // const values = [limit, (page - 1) * limit];

    // if (category) {
    //   query += ' WHERE category = $3';
    //   values.push(category);
    // }
    // if (min_price) {
    //   query += ' AND price >= $4';
    //   values.push(min_price);
    // }
    // if (max_price) {
    //   query += ' AND price <= $5';
    //   values.push(max_price);
    // }
    const queryObject = {};

    if (category) {
      queryObject['category'] = category;
    }
    if (min_price && max_price) {
      queryObject['AND'] = [
        { price: { gt: min_price } },
        { price: { lt: max_price } },
      ];
    } else if (max_price && !min_price) {
      queryObject['price'] = {
        lt: max_price,
      };
    } else if (min_price && !max_price) {
      queryBody['price'] = {
        gt: min_price,
      };
    }

    console.log(queryObject);

    try {
      // const products = await this.pg.query(query, values);
      const products = await this.prisma.products.findMany({
        where: queryObject,
        skip: (page - 1) * limit,
        take: limit,
      });

      if (products.length === 0) {
        throw new NotFoundException('No products found.');
      }

      return {
        message: 'Products retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: products,
        page,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductById(product_id: number) {
    try {
      const product = await this.prisma.products.findUnique({
        where: {
          id: product_id,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      return {
        message: 'Product retrieved.',
        status: 'success',
        statusCode: 200,
        data: product,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async searchProducts(query: any) {
    const { search, page = 1, limit = 10 } = query;
    try {
      const products = await this.prisma.products.findMany({
        where: {
          product_name: {
            contains: search.toLowerCase(),
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(products);
      if (!products) {
        throw new NotFoundException('No products found.');
      }

      return {
        message: 'Product retrieved',
        status: 'success',
        statusCode: 200,
        data: products,
        page,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProduct(product_id: any, dto: UpdateProductDto) {
    try {
      const product = await this.prisma.products.update({
        where: {
          id: product_id,
        },
        data: dto,
        select: {
          product_name: true,
          product_description: true,
          category: true,
          price: true,
          quantity: true,
        },
      });

      if (!product) {
        throw new InternalServerErrorException('Product could not be updated');
      }

      return {
        message: 'Product has been updated.',
        status: 'success',
        statusCode: 200,
        data: product,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteProduct(product_id: number) {
    try {
      // const query = 'DELETE FROM products WHERE id = $1';
      // const result = await this.pg.query(query, [product_id]);

      const product = await this.prisma.products.delete({
        where: {
          id: product_id,
        },
      });

      if (!product) {
        throw new InternalServerErrorException('Product could not be deleted.');
      }

      return {
        message: 'Products deleted successfully',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addReview(user: User, product_id: number, dto: ReviewDto) {
    try {
      const query =
        'INSERT INTO reviews (user_id, username, content, rating, product_id) VALUES ($1, $2, $3, $4, $5)';
      const values = [
        user.sub,
        user.username,
        dto.content,
        dto.rating,
        product_id,
      ];

      const review = await this.prisma.reviews.create({
        data: {
          users: {
            connect: {
              id: user.sub,
            },
          },
          username: user.username,
          content: dto.content,
          rating: dto.rating,
          products: {
            connect: {
              id: product_id,
            },
          },
        },
      });
      if (!review) {
        throw new InternalServerErrorException('Review could not be added.');
      }

      return {
        message: 'Review added successfully',
        status: 'success',
        statusCode: 200,
        data: review,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getReviews(product_id: number) {
    try {
      const reviews = await this.prisma.reviews.findMany({
        where: {
          product_id: product_id,
        },
      });

      if (!reviews) {
        throw new NotFoundException('No reviews found for this product.');
      }

      return {
        message: 'Reviews retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: reviews,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getRating(product_id: number) {
    try {
      const rating = await this.prisma.reviews.aggregate({
        where: {
          id: product_id,
        },
        _avg: { rating: true },
        _max: { rating: true },
        _min: { rating: true },
      });

      if (!rating) {
        throw new InternalServerErrorException('Rating could not be retrieved');
      }

      return {
        message: 'Rating retrieved successfully',
        status: 'success',
        statusCode: 200,
        rating,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addToCart(user: User, productId: number, dto: CreateCartDto) {
    try {
      // let product = await this.pg.query(
      //   'SELECT * FROM products where id = $1',
      //   [productId],
      // );

      const product = await this.prisma.products.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new InternalServerErrorException(
          'Product with ID could not be found',
        );
      }

      const cart = await this.prisma.cart_items.create({
        data: {
          cart: {
            connect: {
              id: user.cart_id,
            },
          },
          product_id: productId,
          product_name: product.product_name,
          product_description: product.product_description,
          product_img: product.product_img,
          quantity: dto.quantity,
          price: product.price * dto.quantity,
          discount: dto.discount,
        },
      });

      if (!cart) {
        throw new InternalServerErrorException(
          'Product could not be added to cart',
        );
      }

      return {
        message: 'Product added to cart.',
        status: 'success',
        statusCode: 200,
        data: cart,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
