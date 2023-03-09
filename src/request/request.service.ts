import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}
  async create(userId: number, createRequestDto: CreateRequestDto) {
    //check if book exists and has copies
    const book = await this.prisma.book.findUnique({
      where: {
        id: createRequestDto.bookId,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.copies < 1) {
      throw new BadRequestException('No copies available');
    }

    const request = await this.prisma.request.create({
      data: {
        userId,
        bookId: createRequestDto.bookId,
        type: createRequestDto.type,
      },
    });
    return request;
  }

  async findAll(userId: number) {
    let requests: Request[];
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user.roles === 'admin') {
      requests = await this.prisma.request.findMany();
    } else {
      requests = await this.prisma.request.findMany({
        where: {
          userId: userId,
        },
      });
    }
    return requests;
  }

  async findOne(userId: number, id: number) {
    let request: Request;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user.roles === 'admin') {
      request = await this.prisma.request.findFirst({
        where: {
          id,
        },
      });
    } else {
      request = await this.prisma.request.findFirst({
        where: {
          id,
          userId,
        },
      });
    }
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    const request = await this.prisma.request.findUnique({
      where: {
        id,
      },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status === 'approved' || request.status === 'rejected') {
      throw new BadRequestException(
        `Request has already been set to ${request.status}`,
      );
    }

    // check if request can be processed
    const book = await this.prisma.book.findUnique({
      where: {
        id: request.bookId,
      },
    });

    // throw error if there is no book
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.copies < 1) {
      throw new BadRequestException('There are no copies');
    }

    // this should be a transaction
    let copies = book.copies;
    if (updateRequestDto.status === 'approved') {
      if (request.type === 'checkout') {
        copies = book.copies - 1;
      } else if (request.type === 'return') {
        copies = book.copies + 1;
      }
      const updatedBook = await this.prisma.book.update({
        where: {
          id: request.bookId,
        },
        data: {
          copies: copies,
        },
      });
    }

    const updatedRequest = await this.prisma.request.update({
      where: {
        id: id,
      },
      data: {
        status: updateRequestDto.status,
      },
    });

    return updatedRequest;
  }
}
