import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ACGuard, UseRoles } from 'nest-access-control';
import { JwtGuard } from 'src/auth/guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@UseGuards(JwtGuard, ACGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseRoles({
    possession: 'any',
    action: 'create',
    resource: 'book',
  })
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'books',
  })
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'book',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'book',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'book',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
