import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostgresService } from './postgres.service';

@Controller('postgres')
export class PostgresController {
  constructor(private readonly postgresService: PostgresService) {}
}
