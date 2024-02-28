import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomBytes } from 'crypto';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private eventEmmiter: EventEmitter2,
  ) {}

  private randomString() {
    return randomBytes(3).toString('hex');
  }

  async register(dto: CreateUserDto) {
    try {
      const verificationToken = this.randomString();
      const passwordhash = await argon.hash(dto.password);
      const newUser = await this.prisma.users.create({
        data: {
          username: dto.username,
          first_name: dto.first_name,
          last_name: dto.last_name,
          avatar: dto.avatar,
          billing_address: dto.billing_address,
          shipping_address: dto.shipping_address,
          phone_number: dto.phone_number,
          date_of_birth: dto.date_of_birth,
          user_role: dto.user_role,
          email: dto.email,
          passwordhash: passwordhash,
          verificationtoken: verificationToken,
        },
      });

      if (!newUser) {
        throw new InternalServerErrorException('User could not be created.');
      }

      const data = {
        to: dto.email,
        username: dto.username,
        token: verificationToken,
      };

      this.eventEmmiter.emit('verify-user', data);

      const cart = await this.prisma.cart.create({
        data: {
          user_id: newUser.id,
        },
      });

      if (!cart) {
        throw new InternalServerErrorException('Cart could not be created');
      }

      console.log('Cart created');

      const addToUser = await this.prisma.users.update({
        where: {
          id: newUser.id,
        },
        data: {
          cart_id: cart.id,
        },
      });

      if (!addToUser) {
        throw new InternalServerErrorException('user not updated');
      }

      return {
        message: 'User Registered. Check email for verification Token',
        status: 'success',
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signIn(dto: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new NotFoundException('User with email not found');
      }

      if (!user.verified) {
        const verificationToken = this.randomString();

        const update = await this.prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            verificationtoken: verificationToken,
          },
        });

        const data = {
          to: update.email,
          username: update.username,
          token: update.verificationtoken,
        };

        this.eventEmmiter.emit('verify-user', data);

        return {
          message: 'Token has been sent to your email',
          status: 'success',
          statusCode: 200,
        };
      }

      const match = await argon.verify(user?.passwordhash, dto.password);

      if (!match) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        roles: [user.user_role.toLowerCase()],
        cart_id: user.cart_id,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('SECRET'),
      });

      return {
        access_token: token,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verifyAccount(token: string) {
    try {
      const user = await this.prisma.users.update({
        where: {
          verificationtoken: token,
        },
        data: {
          verified: true,
        },
      });

      if (!user.verified) {
        throw new InternalServerErrorException('User could not be verified');
      }

      return {
        message: 'Account verified',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });

      const verificationToken = this.randomString();
      const result = await this.prisma.users.update({
        where: {
          email: user.email,
        },
        data: {
          verificationtoken: verificationToken,
        },
      });

      if (!result) {
        throw new InternalServerErrorException('Could not generate OTP');
      }

      const data = {
        to: dto.email,
        username: user.username,
        token: verificationToken,
      };

      await this.eventEmmiter.emit('forgot-password', data);

      return {
        message: 'Reset token has been sent to your email',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (user.verificationtoken !== dto.token) {
        throw new BadRequestException('Invalid token');
      }

      const passwordhash = await argon.hash(dto.password);
      const update = await this.prisma.users.update({
        where: {
          email: dto.email,
        },
        data: {
          passwordhash: passwordhash,
          verificationtoken: undefined,
        },
      });

      if (!update) {
        throw new InternalServerErrorException('Password could not be reset');
      }

      const data = {
        to: dto.email,
        username: user.username,
      };

      this.eventEmmiter.emit('reset-password', data);

      return {
        message: 'Password reset successfully',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resendToken(email: string) {
    try {
      const token = this.randomString();
      const user = await this.prisma.users.update({
        where: {
          email: email,
        },
        data: {
          verificationtoken: token,
        },
      });

      if (!user) {
        throw new InternalServerErrorException(
          'Verification token could not be reset',
        );
      }

      const data = {
        to: email,
        username: user.username,
        token: token,
      };

      this.eventEmmiter.emit('resend-token', data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
