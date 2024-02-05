import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PostgresService } from 'src/postgres/postgres.service';

@Injectable()
export class ProductsService {
  constructor(private pg: PostgresService) {}

  async addProduct(user_id, dto: CreateProductDto) {
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

  async getAllProducts() {
    try {
      const products = await this.pg.query('SELECT * FROM products');

      if (products.rows.length === 0) {
        throw new NotFoundException('No products found.');
      }

      return {
        message: 'Products retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: products.rows[0],
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

  async updateProduct(product_id: any, dto: UpdateProductDto) {
    try {
      const query = 'UPDATE products SET WHERE product_id = $1 RETURNING *';
      const values = [
        dto.product_name,
        dto.product_description,
        dto.price,
        dto.category,
        dto.quantity,
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
}
