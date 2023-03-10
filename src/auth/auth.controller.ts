import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtGuard } from './guard';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @UseGuards(JwtGuard, ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'me',
  })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
