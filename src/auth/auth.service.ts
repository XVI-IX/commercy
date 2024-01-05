import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import * as argon from 'argon2';
import { PostgresService } from 'src/postgres/postgres.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private pg: PostgresService,
    private eventEmmiter: EventEmitter2,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      const verificationToken = v4(6);
      const passwordhash = await argon.hash(dto.password);
      const query =
        'INSERT INTO users (username, first_name, last_name, avatar, billing_address, shipping_address, phone_number, date_of_birth, order_history, user_role, email, passwordhash, verificationToken) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
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

      const result = this.pg.query(query, values);
      if (!result) {
        throw new InternalServerErrorException('User could not be registered.');
      }

      this.eventEmmiter.emit("verify-user", {});

      return {
        message: 'User Registered. Check email for verification Token',
        status: 'success',
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'User could not be registered. Try again.',
      );
    }
  }
  async signIn(email: string, password: string) {
    try {
      const user = await this.pg.getUser(email);

      if (user?.passwordhash !== password) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.user_id,
        username: user.username,
        email: user.email,
        role: user.user_role,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('SECRET'),
      });

      return {
        access_token: token,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not sign in.');
    }
  }
}
