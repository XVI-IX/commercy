import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/update-user.dto';
import { User, Roles } from '../decorator';
import { Role } from '../enums';
import { UpdateRoleDto } from './dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Roles(Role.Admin, Role.User)
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  getProfile(@User() user: any) {
    return this.userService.getProfile(user.email);
  }

  @Put('/:userId')
  @Roles(Role.Admin, Role.User)
  @HttpCode(200)
  updateProfile(
    @Param('userId', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @Put('/changeRole/:userId')
  @Roles(Role.Admin)
  @HttpCode(200)
  updateRole(
    @Param('userId', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.userService.changeRole(id, dto);
  }

  @Delete('/:userId')
  @Roles(Role.Admin, Role.User)
  @HttpCode(200)
  deleteProfile(@Param('userId', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
