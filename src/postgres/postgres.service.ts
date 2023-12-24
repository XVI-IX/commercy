import { Injectable } from '@nestjs/common';
import { CreatePostgreDto } from './dto/create-postgre.dto';
import { UpdatePostgreDto } from './dto/update-postgre.dto';

@Injectable()
export class PostgresService {
  create(createPostgreDto: CreatePostgreDto) {
    return 'This action adds a new postgre';
  }

  findAll() {
    return `This action returns all postgres`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postgre`;
  }

  update(id: number, updatePostgreDto: UpdatePostgreDto) {
    return `This action updates a #${id} postgre`;
  }

  remove(id: number) {
    return `This action removes a #${id} postgre`;
  }
}
