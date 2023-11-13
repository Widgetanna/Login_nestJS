import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { UserEntity } from './model/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, JwtModule],
  providers: [UserService, AuthService, AuthService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
