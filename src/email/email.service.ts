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
        template: 'verify-email',
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
      await this.mailService.sendMail({
        to: data.to,
        subject: `Welcome ${data.username}!`,
        template: 'welcome-email',
        context: {
          username: data.username,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Create email to send when log in event occurs
  // async sendLoggedInEmail(data: any) {
  //   try {
  //   } catch (error) {}
  // }

  async sendForgotPassEmail(data: any) {
    try {
      await this.mailService.sendMail({
        to: data.to,
        subject: `Reset Token`,
        template: 'forgot-password',
        context: {
          username: data.username,
          token: data.token,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resetPasswordEmail(data: any) {
    try {
      await this.mailService.sendMail({
        to: data.to,
        subject: `${data.username}, your password has been reset.`,
        template: 'reset-password',
        context: {
          username: data.username,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @OnEvent('verify-user')
  handleUserVerification(data: any) {
    this.sendVerificationEmail(data);
  }

  @OnEvent('welcome-user')
  handleUserWelcome(data: any) {
    this.sendWelcomeEmail(data);
  }

  // @OnEvent('logged-in')
  // handleUserLogin(data: any) {
  //   this.sendLoggedInEmail(data);
  // }

  @OnEvent('forgot-password')
  handleForgotPassword(data: any) {
    this.sendForgotPassEmail(data);
  }

  @OnEvent('reset-password')
  handleResetPassword(data: any) {
    this.resetPasswordEmail(data);
  }
}
