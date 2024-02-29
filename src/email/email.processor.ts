import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email')
export class EmailProcessor {
  constructor(
    private email: MailerService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Process('welcome-user')
  async sendWelcomeEmail(job: Job<EmailData>) {
    const { data } = job;

    try {
      await this.email.sendMail({
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

  @Process('verify-user')
  async sendVerificationEmail(job: Job<EmailData>) {
    const { data } = job;

    try {
      const subject = `${data.username}, Please verify your account.`;

      await this.email.sendMail({
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

  @Process('forgot-password')
  async sendForgotPassEmail(job: Job<EmailData>) {
    const { data } = job;

    try {
      await this.email.sendMail({
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

  @Process('reset-password')
  async resetPasswordEmail(job: Job<EmailData>) {
    const { data } = job;

    try {
      await this.email.sendMail({
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

  @Process('resend-token')
  async resendTokenEmail(job: Job<EmailData>) {
    const { data } = job;

    try {
      await this.email.sendMail({
        to: data.to,
        subject: 'Your token has been reset',
        template: 'resend-token',
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
}
