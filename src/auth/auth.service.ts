import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly userService: UserService,
  ) {}

  async signIn(email, password) {
    try {
      const user = await this.userService.findByEmail(email);

      if (user?.password !== password) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
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
