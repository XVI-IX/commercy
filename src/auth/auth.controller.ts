import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/decorator/user.decorator';
import { LoginDto } from './dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }
}
