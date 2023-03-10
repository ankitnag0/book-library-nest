import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookService } from '../book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { bookStub } from './stubs/book.stub';

describe('BookService', () => {
  let service: BookService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a book', async () => {
      const book = bookStub();
      const createBookDto: CreateBookDto = {
        title: book.title,
        author: book.author,
        description: book.description,
        copies: book.copies,
      };

      jest.spyOn(prismaService.book, 'create').mockResolvedValue(book);

      const result = await service.create(createBookDto);
      expect(result).toEqual(book);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const book = bookStub();
      const books = [book];

      jest.spyOn(prismaService.book, 'findMany').mockResolvedValue(books);

      const result = await service.findAll();
      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const book = bookStub();

      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(book);

      const result = await service.findOne(book.id);
      expect(result).toEqual(book);
    });

    it('should throw a NotFoundException if the book is not found', async () => {
      const bookId = 1;

      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(null);

      try {
        await service.findOne(bookId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Book not found');
      }
    });
  });
});
