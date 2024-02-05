import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class PostgresService {
  private readonly pool: Pool;

  constructor(private config: ConfigService) {
    try {
      this.pool = new Pool({
        connectionString: this.config.get('DATABASE_URL'),
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Postgres connection failed');
    }
  }

  async query(text: string, values: any[] = []): Promise<any> {
    try {
      const result = await this.pool.query(text, values);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(user_email: string): Promise<any> {
    const user_query = `SELECT * FROM users WHERE email = $1`;
    const user_values = [user_email];
    try {
      const rows = await this.pool.query(user_query, user_values);

      if (!rows.rows[0]) {
        throw new NotFoundException('User not found.');
      }

      return rows.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
