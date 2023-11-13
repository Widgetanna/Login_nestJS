import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { RolesGuard } from './guards/roles_guards';
import { JwtAuthGuard } from './guards/jwt-gward';
import { JwtStrategy } from './guards/jwt-strategy';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        secret: 'toto', //configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30s' },
      }),
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
