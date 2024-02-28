import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserUpdateDto, UpdateRoleDto } from './dto';
import { PostgresService } from 'src/postgres/postgres.service';

@Injectable()
export class UserService {
  constructor(private pg: PostgresService) {}

  async getProfile(user_email: string) {
    try {
      const user = await this.pg.getUser(user_email);

      return {
        message: 'User profile retrieved',
        status: 'success',
        statusCode: 200,
        data: {
          user_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
          billing_address: user.billing_address,
          shipping_address: user.shipping_address,
          phone_number: user.phone_number,
          order_history: user.order_history,
          wishlist: user.wishlist,
          email: user.email,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProfile(id: string, dto: UserUpdateDto) {
    try {
      const query =
        'UPDATE users SET first_name = $1, last_name = $2, avatar = $3, billing_address = $4, shipping_address = $5, phone_number = $6, date_of_birth = $7, modified_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
      const values = [
        dto.first_name,
        dto.last_name,
        dto.avatar,
        dto.billing_address,
        dto.shipping_address,
        dto.phone_number,
        dto.date_of_birth,
        id,
      ];

      const user = await this.pg.query(query, values);
      console.log(user.rows);
      if (!user) {
        throw new InternalServerErrorException(
          'User data could not be updated',
        );
      }

      return {
        message: 'User data updated successfully',
        status: 'success',
        statusCode: 200,
        data: {
          username: user.rows[0].username,
          first_name: user.rows[0].first_name,
          last_name: user.rows[0].last_name,
          email: user.rows[0].email,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changeRole(user_id: string, dto: UpdateRoleDto) {
    try {
      const query = 'UPDATE users SET user_role = $1 WHERE id = $2 RETURNING *';
      const values = [dto.role, user_id];
      const user = await this.pg.query(query, values);

      if (!user) {
        throw new InternalServerErrorException(
          'User role could not be updated.',
        );
      }

      console.log(user.rows);

      return {
        message: 'User role updated.',
        status: 'success',
        statusCode: 200,
        data: {
          email: user.rows[0].email,
          username: user.rows[0].username,
          role: user.rows[0].user_role,
          first_name: user.rows[0].first_name,
          last_name: user.rows[0].last_name,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const query = 'DELETE FROM users WHERE id = $1';

      const user = await this.pg.query(query, [id]);

      if (!user) {
        throw new InternalServerErrorException('User could not be deleted');
      }

      return {
        message: 'User deleted successfully',
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
