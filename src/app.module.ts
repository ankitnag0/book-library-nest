import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { AccessControlModule, ACGuard } from 'nest-access-control';
import { RBAC_POLICY } from './auth/rbac-policy';
import { APP_GUARD } from '@nestjs/core';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccessControlModule.forRoles(RBAC_POLICY),
    PrismaModule,
    AuthModule,
    BookModule,
    RequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
