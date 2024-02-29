import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserUpdateDto, UpdateRoleDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(user_email: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: user_email,
        },
        select: {
          id: true,
          username: true,
          last_name: true,
          first_name: true,
          avatar: true,
          billing_address: true,
          shipping_address: true,
          phone_number: true,
          order_history: true,
          wishlist: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User profile retrieved',
        status: 'success',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProfile(id: number, dto: UserUpdateDto) {
    try {
      const user = await this.prisma.users.update({
        where: {
          id: id,
        },
        data: dto,
        select: {
          username: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      });
      if (!user) {
        throw new InternalServerErrorException(
          'User data could not be updated',
        );
      }

      return {
        message: 'User data updated successfully',
        status: 'success',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changeRole(user_id: number, dto: UpdateRoleDto) {
    try {
      const user = await this.prisma.users.update({
        where: {
          id: user_id,
        },
        data: {
          user_role: dto.role,
        },
        select: {
          email: true,
          username: true,
          user_role: true,
          first_name: true,
          last_name: true,
        },
      });

      if (!user) {
        throw new InternalServerErrorException(
          'User role could not be updated.',
        );
      }

      return {
        message: 'User role updated.',
        status: 'success',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.users.delete({
        where: {
          id: id,
        },
      });

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
