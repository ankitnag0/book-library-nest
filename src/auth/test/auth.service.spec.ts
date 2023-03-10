import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthService } from '../auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { User } from '@prisma/client';
import { Role } from '../enum';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, ConfigService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should sign up a new user', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        roles: Role.USER,
        address: null,
        phone: null,
      };

      const hash = await argon.hash(signUpDto.password, {
        salt: Buffer.from(
          'howmuchwoodwouldawoodchuckchuckifawoodchuckcouldchuckwood',
        ),
      });

      const user: User = {
        id: 1,
        email: signUpDto.email,
        hash,
        name: signUpDto.name,
        roles: signUpDto.roles,
        address: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      const result = await service.signup(signUpDto);
      expect(result.accessToken).toBeDefined();
    });

    it('should throw a ForbiddenException if email is already taken', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        roles: Role.USER,
        address: null,
        phone: null,
      };

      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new ForbiddenException('Email is already taken'));

      try {
        await service.signup(signUpDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('Email is already taken');
      }
    });
  });

  describe('signin', () => {
    it('should sign in a user', async () => {
      const signInDto: SignInDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const hash = await argon.hash(signInDto.password, {
        salt: Buffer.from(
          'howmuchwoodwouldawoodchuckchuckifawoodchuckcouldchuckwood',
        ),
      });

      const user: User = {
        id: 1,
        email: signInDto.email,
        hash,
        name: 'Test User',
        roles: Role.USER,
        address: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.signin(signInDto);
      expect(result.accessToken).toBeDefined();
    });
    it('should throw a ForbiddenException if email or password is invalid', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      try {
        await service.signin(signInDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('Email or password is invalid');
      }
    });

    it('should throw a ForbiddenException if password is incorrect', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        hash: await argon.hash('correctpassword'),
        name: 'Test Name',
        phone: null,
        address: null,
        roles: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      try {
        await service.signin(signInDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('Email or password is invalid');
      }
    });

    it('should sign in the user and return an access token if email and password are correct', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        hash: await argon.hash('testpassword'),
        name: 'Test Name',
        phone: null,
        address: null,
        roles: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = 'testtoken';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest
        .spyOn(service, 'signToken')
        .mockResolvedValue({ accessToken: token });

      const result = await service.signin(signInDto);
      expect(result).toEqual({ accessToken: token });
    });
  });

  describe('signToken', () => {
    it('should return a signed JWT access token', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const token = 'testtoken';
      const secret = 'testsecret';
      jest.spyOn(configService, 'get').mockReturnValue(secret);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.signToken(userId, email);

      expect(result).toEqual({ accessToken: token });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, email },
        { expiresIn: '15m', secret },
      );
    });
  });
});
