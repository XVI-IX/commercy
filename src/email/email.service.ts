import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(
    private readonly config: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  async sendVerificationEmail(data: any) {
    try {
      const subject = `${data.username}, Please verify your account.`;

      await this.mailService.sendMail({
        to: data.to,
        subject,
        template: './verify-email',
        context: {
          name: data.username,
          token: data.token,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendWelcomeEmail(data: any) {
    try {
    } catch (error) {}
  }

  async sendLoggedInEmail(data: any) {
    try {
    } catch (error) {}
  }

  @OnEvent('verify-user')
  handleUserVerification(data: any) {
    this.sendVerificationEmail(data);
  }

  @OnEvent('welcome-user')
  handleUserWelcome(data: any) {
    this.sendWelcomeEmail(data);
  }

  @OnEvent('logged-in')
  handleUserLogin(data: any) {
    this.sendLoggedInEmail(data);
  }
}
