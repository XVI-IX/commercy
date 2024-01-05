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
import { CreatePostgreDto } from './dto/create-postgre.dto';
import { UpdatePostgreDto } from './dto/update-postgre.dto';

@Controller('postgres')
export class PostgresController {
  constructor(private readonly postgresService: PostgresService) {}
}
