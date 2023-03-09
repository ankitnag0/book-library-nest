import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ACGuard, UseRoles } from 'nest-access-control';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard, ACGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'users',
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'user',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'user',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
