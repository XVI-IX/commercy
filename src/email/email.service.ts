import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailerService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  @OnEvent('verify-user')
  handleUserVerification(data: any) {
    this.sendVerificationEmail(data);
  }

  @OnEvent('welcome-user')
  async handleUserWelcome(data: any) {
    const job = await this.emailQueue.add('welcome-user', data);

    return {
      message: 'Welcome email sent',
      job_id: job.id,
    };
  }

  @OnEvent('forgot-password')
  async handleForgotPassword(data: any) {
    const job = await this.emailQueue.add('forgot-password', data);

    return {
      message: 'forgot passwoed sent',
      job_id: job.id,
    };
  }

  @OnEvent('reset-password')
  async handleResetPassword(data: any) {
    const job = await this.emailQueue.add('reset-password', data);

    return {
      message: 'reset password email sent',
      job_id: job.id,
    };
  }

  @OnEvent('resend-token')
  async handleResendToken(data: any) {
    const job = await this.emailQueue.add('resend-token', data);

    return {
      message: 'resend token email sent',
      job_id: job.id,
    };
  }
}
