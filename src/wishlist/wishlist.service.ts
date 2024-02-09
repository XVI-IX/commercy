import { Injectable } from '@nestjs/common';
import { PostgresService } from 'src/postgres/postgres.service';

@Injectable()
export class WishlistService {
  constructor (
    private pg: PostgresService
  ) {}

  async addToWishlist(user: any, product_id: string) {
    try {
      const query = 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getWishlist(user: any) {
    try {
      
    } catch (error) {
      
    }
  }

  async deleteFromWishlist(user: any, product_id: string) {
    try {
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async clearWishlist(user: any) {
    try {
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
