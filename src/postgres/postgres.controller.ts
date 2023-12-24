import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { CreatePostgreDto } from './dto/create-postgre.dto';
import { UpdatePostgreDto } from './dto/update-postgre.dto';

@Controller('postgres')
export class PostgresController {
  constructor(private readonly postgresService: PostgresService) {}

  @Post()
  create(@Body() createPostgreDto: CreatePostgreDto) {
    return this.postgresService.create(createPostgreDto);
  }

  @Get()
  findAll() {
    return this.postgresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postgresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostgreDto: UpdatePostgreDto) {
    return this.postgresService.update(+id, updatePostgreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postgresService.remove(+id);
  }
}
