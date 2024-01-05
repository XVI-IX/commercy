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
    this.pool = new Pool({
      user: this.config.get<string>('DB_USERNAME'),
      host: this.config.get<string>('DB_HOST'),
      database: this.config.get<string>('DB_NAME'),
      password: this.config.get<string>('DB_PASSWORD'),
      port: this.config.get<string>('DB_PORT'),
    });
  }

  async query(text: string, values: string[] = []): Promise<any> {
    try {
      const result = await this.pool.query(text, values);
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
    }
  }
}
