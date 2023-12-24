import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { PostgresController } from './postgres.controller';

@Module({
  controllers: [PostgresController],
  providers: [PostgresService],
})
export class PostgresModule {}
