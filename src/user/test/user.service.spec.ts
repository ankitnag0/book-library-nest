import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { userStub } from './stubs/user.stub';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user = userStub();
      const users = [user];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = userStub();

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findOne(user.id);
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      try {
        await service.findOne(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('User not found');
      }
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const user = userStub();

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(user);

      const result = await service.remove(user.id);
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      try {
        await service.remove(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('User not found');
      }
    });
  });
});
