import { PartialType } from '@nestjs/mapped-types';
import { CreatePostgreDto } from './create-postgre.dto';

export class UpdatePostgreDto extends PartialType(CreatePostgreDto) {}
