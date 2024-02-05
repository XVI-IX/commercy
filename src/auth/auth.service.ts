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
import { PostgresService } from 'src/postgres/postgres.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomBytes } from 'crypto';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private pg: PostgresService,
    private eventEmmiter: EventEmitter2,
  ) {}

  private randomString() {
    return randomBytes(3).toString('hex');
  }

  async register(dto: CreateUserDto) {
    try {
      const verificationToken = this.randomString();
      const passwordhash = await argon.hash(dto.password);
      const query =
        'INSERT INTO users (username, first_name, last_name, avatar, billing_address, shipping_address, phone_number, date_of_birth, user_role, email, passwordhash, verificationToken) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
      const values = [
        dto.username,
        dto.first_name,
        dto.last_name,
        dto.avatar,
        dto.billing_address,
        dto.shipping_address,
        dto.phone_number,
        dto.date_of_birth,
        dto.user_role,
        dto.email,
        passwordhash,
        verificationToken,
      ];

      const result = await this.pg.query(query, values);

      if (!result) {
        throw new InternalServerErrorException('User could not be registered.');
      }

      const data = {
        to: dto.email,
        username: dto.username,
        token: verificationToken,
      };

      this.eventEmmiter.emit('verify-user', data);

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
      const user = await this.pg.getUser(dto.email);

      if (!user) {
        throw new NotFoundException('User with email not found');
      }

      if (!user.verified) {
        const verificationToken = this.randomString();

        const query =
          'UPDATE users SET verificationToken = $1 WHERE user_id = $2 RETURNING *';
        const values = [verificationToken, user.user_id];

        const update = await this.pg.query(query, values);

        const data = {
          to: update.rows[0].email,
          username: update.rows[0].username,
          token: update.rows[0].verificationToken,
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
        sub: user.user_id,
        username: user.username,
        email: user.email,
        roles: [user.user_role.toLowerCase()],
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
      const query =
        'SELECT * FROM users WHERE verificationtoken = CAST($1 AS VARCHAR(255));';
      const result = await this.pg.query(query, [token]);

      console.log(result.rows);

      if (result.rows.length === 0) {
        throw new NotFoundException('User with token not found');
      }

      const updateQuery =
        'UPDATE users SET verified = $1 WHERE user_id = $2 RETURNING *';
      const verifyUser = await this.pg.query(updateQuery, [
        true,
        result.rows[0].user_id,
      ]);

      if (!verifyUser.rows[0].verified) {
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
      const user = await this.pg.getUser(dto.email);

      const verificationToken = this.randomString();

      const query = 'UPDATE users SET verificationToken = $1 WHERE email = $2';

      const result = await this.pg.query(query, [verificationToken, dto.email]);

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
      const user = await this.pg.getUser(dto.email);

      if (user.verificationtoken !== dto.token) {
        throw new BadRequestException('Invalid token');
      }

      const passwordhash = await argon.hash(dto.password);

      let query = 'UPDATE users SET passwordhash = $1 WHERE email = $2';

      let result = await this.pg.query(query, [passwordhash, dto.email]);

      if (!result) {
        throw new InternalServerErrorException('Password could not be reset');
      }

      query = 'UPDATE users SET verificationToken = $1 WHERE email = $2';
      result = await this.pg.query(query, [undefined, dto.email]);

      if (!result) {
        throw new InternalServerErrorException(
          'Verification Token could not be reset',
        );
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
}
