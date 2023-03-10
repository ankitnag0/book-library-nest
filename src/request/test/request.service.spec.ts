// create mock data for testing

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { BookService } from '../../book/book.service';
import { UpdateBookDto } from '../../book/dto/update-book.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestType } from '../enum';
import { RequestService } from '../request.service';
import { bookStub } from './stubs/book.stub';

const mockPrismaService = {
  book: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  request: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

const mockUserId = 1;
const mockRequestId = 1;
const mockCreateRequestDto = {
  bookId: 1,
  type: RequestType.CHECKOUT,
};
const mockUpdateRequestDto = {
  status: 'approved',
};
const mockBook = {
  id: 1,
  title: 'Book Title',
  author: 'Book Author',
  description: 'Book Description',
  copies: 2,
};
const mockRequest = {
  id: 1,
  userId: mockUserId,
  bookId: 1,
  type: 'checkout',
  status: 'pending',
};

describe('RequestService', () => {
  let requestService: RequestService;
  let prismaService: PrismaService;
  let bookService: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        BookService,
      ],
    }).compile();

    requestService = module.get<RequestService>(RequestService);
    bookService = module.get<BookService>(BookService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new request for a valid book', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
      mockPrismaService.request.create.mockResolvedValue(mockRequest);

      const result = await requestService.create(
        mockUserId,
        mockCreateRequestDto,
      );

      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreateRequestDto.bookId },
      });
      expect(mockPrismaService.request.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          bookId: mockCreateRequestDto.bookId,
          type: mockCreateRequestDto.type,
        },
      });
      expect(result).toEqual(mockRequest);
    });
  });
  it('should create a new request for a valid book', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
    mockPrismaService.request.create.mockResolvedValue(mockRequest);

    const result = await requestService.create(
      mockUserId,
      mockCreateRequestDto,
    );

    expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
      where: { id: mockCreateRequestDto.bookId },
    });
    expect(mockPrismaService.request.create).toHaveBeenCalledWith({
      data: {
        userId: mockUserId,
        bookId: mockCreateRequestDto.bookId,
        type: mockCreateRequestDto.type,
      },
    });
    expect(result).toEqual(mockRequest);
  });

  it('should throw NotFoundException when book is not found', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue(null);

    await expect(
      requestService.create(mockUserId, mockCreateRequestDto),
    ).rejects.toThrowError(NotFoundException);

    expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
      where: { id: mockCreateRequestDto.bookId },
    });
    expect(mockPrismaService.request.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when book does not have enough copies available', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue({
      ...mockBook,
      copies: 0,
    });

    await expect(
      requestService.create(mockUserId, mockCreateRequestDto),
    ).rejects.toThrowError(BadRequestException);

    expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
      where: { id: mockCreateRequestDto.bookId },
    });
    expect(mockPrismaService.request.create).not.toHaveBeenCalled();
  });
  describe('update', () => {
    it('should update the book with the provided id', async () => {
      const book = bookStub();
      const updateBookDto: UpdateBookDto = {
        title: 'new title',
        author: 'new author',
        description: 'new description',
        copies: 2,
      };

      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(book);
      jest.spyOn(prismaService.book, 'update').mockResolvedValue({
        ...book,
        ...updateBookDto,
      });

      const result = await bookService.update(book.id, updateBookDto);
      expect(result).toEqual({ ...book, ...updateBookDto });
    });

    it('should throw NotFoundException when book with the provided id is not found', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'new title',
        author: 'new author',
        description: 'new description',
        copies: 2,
      };

      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(null);

      expect(bookService.update(1, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
