import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ReviewDto } from './dto';
import { PostgresService } from 'src/postgres/postgres.service';
import { CreateCartDto } from 'src/cart/dto';

@Injectable()
export class ProductsService {
  constructor(private pg: PostgresService) {}

  async addProduct(user_id: string, dto: CreateProductDto) {
    try {
      const query =
        'INSERT INTO products (user_id, product_name, product_description, price, category, quantity) VALUES ($1, $2, $3, $4, $5, $6)';
      const values = [
        user_id,
        dto.product_name,
        dto.product_description,
        dto.price,
        dto.category,
        dto.quantity,
      ];

      const product = await this.pg.query(query, values);

      if (!product) {
        throw new InternalServerErrorException('Product could not be added.');
      }

      return {
        message: 'Product has been added successfully.',
        status: 'success',
        statusCode: 201,
        data: product.rows[0],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllProducts(queryBody: any) {
    const { category, min_price, max_price, page = 1, limit = 10 } = queryBody;

    let query = 'SELECT * FROM products LIMIT $1 OFFSET $2';
    const values = [limit, (page - 1) * limit];

    if (category) {
      query += ' WHERE category = $3';
      values.push(category);
    }
    if (min_price) {
      query += ' AND price >= $4';
      values.push(min_price);
    }
    if (max_price) {
      query += ' AND price <= $5';
      values.push(max_price);
    }
    try {
      const products = await this.pg.query(query, values);

      if (products.rows.length === 0) {
        throw new NotFoundException('No products found.');
      }

      return {
        message: 'Products retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: products.rows,
        page,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductById(product_id: string) {
    try {
      const query = 'SELECT * FROM products WHERE product_id = $1';
      const product = await this.pg.query(query, [product_id]);

      if (product.rows.length === 0) {
        throw new NotFoundException('Product not found.');
      }

      return {
        message: 'Product retrieved.',
        status: 'success',
        statusCode: 200,
        data: product.rows[0],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async searchProducts(query: any) {
    const { search, page = 1, limit = 10 } = query;
    console.log(search, page, limit);
    try {
      const query =
        'SELECT * FROM products WHERE product_name ILIKE $1 LIMIT $2 OFFSET $3';

      const searchPattern = `%${search}%`; // adding % for pattern matching
      const values = [searchPattern, limit, (page - 1) * limit];

      const result = await this.pg.query(query, values);
      console.log(result);
      if (result.rows.length === 0) {
        throw new NotFoundException('No products found.');
      }

      return {
        message: 'Product retrieved',
        status: 'success',
        statusCode: 200,
        data: result.rows,
        page,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProduct(product_id: any, dto: UpdateProductDto) {
    try {
      const query =
        'UPDATE products SET product_name = $1, product_description = $2, price = $3, category = $4, quantity = $5, product_img = $6 WHERE product_id = $7 RETURNING *';
      const values = [
        dto.product_name,
        dto.product_description,
        dto.price,
        dto.category,
        dto.quantity,
        dto.product_img,
        product_id,
      ];

      const product = await this.pg.query(query, values);

      if (!product) {
        throw new InternalServerErrorException('Product could not be updated');
      }

      return {
        message: 'Product has been updated.',
        status: 'success',
        statusCode: 200,
        data: {
          product_name: product.rows[0].product_name,
          product_description: product.rows[0].product_description,
          category: product.rows[0].category,
          price: product.rows[0].price,
          quantity: product.rows[0].quantity,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteProduct(product_id: string) {
    try {
      const query = 'DELETE FROM products WHERE product_id = $1';
      const result = await this.pg.query(query, [product_id]);

      if (!result) {
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

  async addReview(user: any, product_id: string, dto: ReviewDto) {
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

      const result = await this.pg.query(query, values);
      if (!result) {
        throw new InternalServerErrorException('Review could not be added.');
      }

      return {
        message: 'Review added successfully',
        status: 'success',
        statusCode: 200,
        data: result.rows[0],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getReviews(product_id: string) {
    try {
      const result = await this.pg.query(
        'SELECT * FROM reviews WHERE product_id = $1',
        [product_id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('No reviews found for this product.');
      }

      return {
        message: 'Reviews retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: result.rows[0],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getRating(product_id: string) {
    try {
      const query =
        'SELECT AVG(rating), MIN(rating), MAX(rating) FROM reviews WHERE product_id = $1';

      const result = await this.pg.query(query, [product_id]);

      if (!result) {
        throw new InternalServerErrorException('Rating could not be retrieved');
      }

      return {
        message: 'Rating retrieved successfully',
        status: 'success',
        statusCode: 200,
        rating: result.rows[0],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addToCart(user: any, productId: string, dto: CreateCartDto) {
    try {
      const query =
        'INSERT INTO cart_items (cart_id, product_id, quantity, price, discount) VALUES ($1, $2, $3, $4, $5)';
      const values = [
        user.cart_id,
        productId,
        dto.quantity,
        dto.price,
        dto.discount,
      ];

      const result = await this.pg.query(query, values);

      if (!result) {
        throw new InternalServerErrorException(
          'Product could not be added to cart',
        );
      }

      return {
        message: 'Product added to cart.',
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
