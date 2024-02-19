import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { User } from 'src/decorator/user.decorator';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './dto';
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
  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @HttpCode(200)
  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @HttpCode(200)
  @Post('/verify-account')
  async verifyAccount(@Body('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @Public()
  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @HttpCode(200)
  @Post('/reset-token')
  async resetToken(@Body('email') email: string) {
    return this.authService.resendToken(email);
  }
}
