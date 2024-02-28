import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PostgresModule } from 'src/postgres/postgres.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PostgresModule, PrismaService],
})
export class UserModule {}
