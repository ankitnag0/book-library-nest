import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { UpdateRequestDto } from './dto/update-request.dto';

@UseGuards(JwtGuard, ACGuard)
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseRoles({
    possession: 'own',
    action: 'create',
    resource: 'request',
  })
  create(
    @GetUser('id') userId: number,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestService.create(userId, createRequestDto);
  }

  @Get()
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'requests',
  })
  findAll(@GetUser('id') userId: number) {
    return this.requestService.findAll(userId);
  }

  @Get(':id')
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'request',
  })
  findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.requestService.findOne(userId, id);
  }

  @Patch(':id')
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'request',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return this.requestService.update(id, updateRequestDto);
  }
}
