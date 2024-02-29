import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER || 'oladoja14@gmail.com',
          pass: process.env.MAIL_PASS || 'wbciyjaxrdcdbtco',
        },
      },
      defaults: {
        from: 'oladoja14@gmail.com',
      },
      template: {
        dir: './src/templates',
        adapter: new EjsAdapter(),
      },
    }),
    BullModule.registerQueue({
      name: 'email'
    });
  ],
})
export class EmailModule {}
