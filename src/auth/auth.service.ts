import {
  ForbiddenException,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async signup(signUpDto: SignUpDto) {
    // hash the password
    const hash = await argon.hash(signUpDto.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: signUpDto.email,
          hash,
          name: signUpDto.name,
          roles: signUpDto.roles,
        },
      });

      // delete user.hash;
      // return user;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email is already taken');
        }
      }
      throw error;
    }
  }

  async signin(singInDto: SignInDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: singInDto.email,
      },
    });

    // throw error is no user is found
    if (!user) {
      throw new ForbiddenException('Email or password is invalid');
    }

    // compare password
    const match = await argon.verify(user.hash, singInDto.password);
    // throw error if password do not match
    if (!match) {
      throw new ForbiddenException('Email or password is invalid');
    }

    // delete user.hash;
    // return user;
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { accessToken: token };
  }
}
