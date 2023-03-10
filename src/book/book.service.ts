import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    const book = await this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        description: createBookDto.description,
        copies: createBookDto.copies,
      },
    });
    return book;
  }

  async findAll() {
    const books = await this.prisma.book.findMany();
    return books;
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const updatedBook = await this.prisma.book.update({
      where: {
        id,
      },
      data: {
        ...updateBookDto,
      },
    });

    return updatedBook;
  }

  async remove(id: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const deletedBook = await this.prisma.book.delete({
      where: {
        id,
      },
    });

    return deletedBook;
  }
}
