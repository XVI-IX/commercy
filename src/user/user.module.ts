import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PostgresModule],
})
export class UserModule {}
